import { prisma } from '../../src/config/database';
import { runWithContext } from '../../src/context/request-context';

interface ClientRow {
  id: string;
  tenantId: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  version: number;
  deletedAt: Date | null;
}

describe('prisma extensions (integration)', () => {
  const suffix = Date.now();
  let tenantA: string;
  let tenantB: string;

  beforeAll(async () => {
    const a = await prisma.tenant.create({ data: { name: 'Ext A', slug: `ext-a-${suffix}` } });
    const b = await prisma.tenant.create({ data: { name: 'Ext B', slug: `ext-b-${suffix}` } });
    tenantA = a.id;
    tenantB = b.id;
  });

  afterAll(async () => {
    // Remove all data created under the test tenants, then the tenants.
    for (const t of [tenantA, tenantB]) {
      const clients = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        'SELECT id FROM clients WHERE "tenantId" = $1',
        t
      );
      const ids = clients.map((c) => c.id);
      if (ids.length > 0) {
        await prisma.auditLog.deleteMany({ where: { resourceId: { in: ids } } });
      }
      await prisma.$executeRawUnsafe('DELETE FROM medical_records WHERE "tenantId" = $1', t);
      await prisma.$executeRawUnsafe('DELETE FROM patients WHERE "tenantId" = $1', t);
      await prisma.$executeRawUnsafe('DELETE FROM clients WHERE "tenantId" = $1', t);
    }
    await prisma.$executeRawUnsafe('DELETE FROM tenants WHERE id IN ($1, $2)', tenantA, tenantB);
  });

  function newClient(label: string) {
    return prisma.client.create({
      data: {
        firstName: label,
        lastName: 'Test',
        email: `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
        phone: '1',
        address: 'a',
        city: 'a',
        state: 'a',
        zipCode: 'a',
      },
    });
  }

  it('stamps createdBy/updatedBy and version, and writes audit logs', async () => {
    await runWithContext({ userId: 'tester', tenantId: tenantA }, async () => {
      const client = (await newClient('stamp')) as ClientRow;
      expect(client.createdBy).toEqual('tester');
      expect(client.version).toEqual(1);

      const updated = (await prisma.client.update({
        where: { id: client.id },
        data: { city: 'b' },
      })) as ClientRow;
      expect(updated.version).toEqual(2);
      expect(updated.updatedBy).toEqual('tester');

      const audits = await prisma.auditLog.findMany({
        where: { resource: 'Client', resourceId: client.id },
      });
      const actions = audits.map((a) => a.action);
      expect(actions).toContain('Client.create');
      expect(actions).toContain('Client.update');
    });
  });

  it('soft-deletes: delete() hides the row but keeps it physically', async () => {
    await runWithContext({ userId: 'tester', tenantId: tenantA }, async () => {
      const client = (await newClient('soft')) as ClientRow;
      const deleted = (await prisma.client.delete({ where: { id: client.id } })) as ClientRow;
      expect(deleted.deletedAt).not.toBeNull();

      expect(await prisma.client.findUnique({ where: { id: client.id } })).toBeNull();

      const raw = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
        'SELECT COUNT(*)::bigint AS count FROM clients WHERE id = $1',
        client.id
      );
      expect(Number(raw[0].count)).toEqual(1);
    });
  });

  it('encrypts MedicalRecord PHI at rest and decrypts on read', async () => {
    await runWithContext({ userId: 'tester', tenantId: tenantA }, async () => {
      const staff = await prisma.staff.create({
        data: {
          firstName: 'Doc',
          lastName: 'Vet',
          email: `doc-${Date.now()}@example.com`,
          phone: '1',
          role: 'veterinarian',
          employmentType: 'Full-time',
          hireDate: new Date(),
        },
      });
      const owner = (await newClient('owner')) as ClientRow;
      const patient = await prisma.patient.create({
        data: { name: 'Rex', species: 'Dog', dateOfBirth: new Date('2020-01-01'), gender: 'male', ownerId: owner.id },
      });
      const secret = 'Confidential: lymphoma stage II';
      const record = await prisma.medicalRecord.create({
        data: {
          patientId: patient.id,
          veterinarianId: staff.id,
          visitDate: new Date(),
          chiefComplaint: 'lethargy',
          diagnosis: secret,
          treatment: 'protocol A',
        },
      });
      expect(record.diagnosis).toEqual(secret);

      const raw = await prisma.$queryRawUnsafe<Array<{ diagnosis: string }>>(
        'SELECT diagnosis FROM medical_records WHERE id = $1',
        record.id
      );
      expect(raw[0].diagnosis.startsWith('enc:v1:')).toBe(true);

      const read = await prisma.medicalRecord.findUnique({ where: { id: record.id } });
      expect(read?.diagnosis).toEqual(secret);

      // cleanup staff (not tenant-scoped, not covered by afterAll tenant sweep)
      await prisma.auditLog.deleteMany({ where: { resourceId: record.id } });
      await prisma.$executeRawUnsafe('DELETE FROM medical_records WHERE id = $1', record.id);
      await prisma.$executeRawUnsafe('DELETE FROM staff WHERE id = $1', staff.id);
    });
  });

  it('isolates tenants and fails closed without a tenant', async () => {
    const clientB = (await runWithContext({ userId: 'b', tenantId: tenantB }, () =>
      newClient('btenant')
    )) as ClientRow;

    await runWithContext({ userId: 'a', tenantId: tenantA }, async () => {
      const visible = (await prisma.client.findMany({})) as ClientRow[];
      expect(visible.every((c) => c.tenantId === tenantA)).toBe(true);
      expect(visible.some((c) => c.id === clientB.id)).toBe(false);
      expect(await prisma.client.findUnique({ where: { id: clientB.id } })).toBeNull();
    });

    await runWithContext({ userId: 'noTenant' }, async () => {
      await expect(prisma.client.findMany({})).rejects.toMatchObject({ statusCode: 403 });
    });
  });
});

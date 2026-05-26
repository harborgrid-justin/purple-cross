/* eslint-disable no-console */
/**
 * Manual runtime validation for the Phase 2 Prisma client extensions against a
 * real database. Run with: ./node_modules/.bin/ts-node scripts/phase2-validate.ts
 * Not part of the test suite; safe to delete.
 */
import '../src/config/env'; // loads backend/.env (dotenv) before Prisma is constructed
import { prisma, disconnectDatabase } from '../src/config/database';
import { runWithContext } from '../src/context/request-context';

function assert(label: string, cond: boolean): void {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${label}`);
  if (!cond) process.exitCode = 1;
}

const DEFAULT_TENANT = '00000000-0000-0000-0000-000000000001';

async function main(): Promise<void> {
  const email = `validate+${Date.now()}@example.com`;

  await runWithContext(
    {
      userId: 'user-123',
      correlationId: 'corr-abc',
      ip: '10.0.0.1',
      userAgent: 'jest',
      tenantId: DEFAULT_TENANT,
    },
    async () => {
      const client = await prisma.client.create({
        data: {
          firstName: 'Val',
          lastName: 'Idate',
          email,
          phone: '+1-555-0000',
          address: '1 Test St',
          city: 'Testville',
          state: 'TS',
          zipCode: '00000',
        },
      });
      assert('createdBy stamped on create', client.createdBy === 'user-123');
      assert('updatedBy stamped on create', client.updatedBy === 'user-123');
      assert('version defaults to 1', client.version === 1);

      const updated = await prisma.client.update({
        where: { id: client.id },
        data: { city: 'Updated City' },
      });
      assert('version incremented on update', updated.version === 2);

      const audits = await prisma.auditLog.findMany({
        where: { resource: 'Client', resourceId: client.id },
        orderBy: { timestamp: 'asc' },
      });
      assert('audit row for create exists', audits.some((a) => a.action === 'Client.create'));
      assert('audit row for update exists', audits.some((a) => a.action === 'Client.update'));
      assert('audit userId from context', audits.every((a) => a.userId === 'user-123'));

      // --- soft delete ---
      const deleted = await prisma.client.delete({ where: { id: client.id } });
      assert('delete() sets deletedAt (soft)', (deleted as { deletedAt: Date | null }).deletedAt != null);

      const byUnique = await prisma.client.findUnique({ where: { id: client.id } });
      assert('findUnique hides soft-deleted row', byUnique === null);

      const byMany = await prisma.client.findMany({ where: { email } });
      assert('findMany excludes soft-deleted row', byMany.length === 0);

      const rawCount = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
        'SELECT COUNT(*)::bigint AS count FROM clients WHERE id = $1',
        client.id
      );
      assert('row physically still present', Number(rawCount[0].count) === 1);

      // cleanup (hard delete via raw SQL since delete() is soft)
      await prisma.auditLog.deleteMany({ where: { resourceId: client.id } });
      await prisma.$executeRawUnsafe('DELETE FROM clients WHERE id = $1', client.id);
    }
  );

  // --- field-level encryption (MedicalRecord PHI) ---
  await runWithContext({ userId: 'user-123', tenantId: DEFAULT_TENANT }, async () => {
    const staff = await prisma.staff.create({
      data: {
        firstName: 'Doc',
        lastName: 'Vet',
        email: `vet+${Date.now()}@example.com`,
        phone: '+1-555-0001',
        role: 'veterinarian',
        employmentType: 'Full-time',
        hireDate: new Date(),
      },
    });
    const owner = await prisma.client.create({
      data: {
        firstName: 'Own',
        lastName: 'Er',
        email: `owner+${Date.now()}@example.com`,
        phone: '+1-555-0002',
        address: '2 Test St',
        city: 'Testville',
        state: 'TS',
        zipCode: '00000',
      },
    });
    const patient = await prisma.patient.create({
      data: {
        name: 'Rex',
        species: 'Dog',
        dateOfBirth: new Date('2020-01-01'),
        gender: 'male',
        ownerId: owner.id,
      },
    });

    const SECRET_DX = 'Confidential diagnosis: lymphoma stage II';
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        veterinarianId: staff.id,
        visitDate: new Date(),
        chiefComplaint: 'lethargy',
        diagnosis: SECRET_DX,
        treatment: 'chemotherapy protocol A',
      },
    });
    assert('create returns plaintext diagnosis', record.diagnosis === SECRET_DX);

    const raw = await prisma.$queryRawUnsafe<Array<{ diagnosis: string }>>(
      'SELECT diagnosis FROM medical_records WHERE id = $1',
      record.id
    );
    assert('diagnosis is ciphertext at rest', raw[0].diagnosis.startsWith('enc:v1:'));

    const readBack = await prisma.medicalRecord.findUnique({ where: { id: record.id } });
    assert('findUnique decrypts diagnosis', readBack?.diagnosis === SECRET_DX);

    // cleanup (raw, bypassing soft-delete)
    await prisma.auditLog.deleteMany({ where: { resourceId: record.id } });
    await prisma.$executeRawUnsafe('DELETE FROM medical_records WHERE id = $1', record.id);
    await prisma.$executeRawUnsafe('DELETE FROM patients WHERE id = $1', patient.id);
    await prisma.$executeRawUnsafe('DELETE FROM clients WHERE id = $1', owner.id);
    await prisma.$executeRawUnsafe('DELETE FROM staff WHERE id = $1', staff.id);
  });

  // --- multi-tenancy isolation ---
  const tenantA = await prisma.tenant.create({
    data: { name: 'Clinic A', slug: `a-${Date.now()}` },
  });
  const tenantB = await prisma.tenant.create({
    data: { name: 'Clinic B', slug: `b-${Date.now()}` },
  });

  // Note: await INSIDE the context callback — PrismaPromises are lazy and would
  // otherwise execute outside the AsyncLocalStorage scope.
  const clientA = await runWithContext({ userId: 'uA', tenantId: tenantA.id }, async () => {
    const created = await prisma.client.create({
      data: {
        firstName: 'A',
        lastName: 'Client',
        email: `a+${Date.now()}@example.com`,
        phone: '1',
        address: 'a',
        city: 'a',
        state: 'a',
        zipCode: 'a',
      },
    });
    assert('create sets tenantId from context', created.tenantId === tenantA.id);
    return created;
  });

  const clientB = await runWithContext({ userId: 'uB', tenantId: tenantB.id }, async () =>
    prisma.client.create({
      data: {
        firstName: 'B',
        lastName: 'Client',
        email: `b+${Date.now()}@example.com`,
        phone: '1',
        address: 'b',
        city: 'b',
        state: 'b',
        zipCode: 'b',
      },
    })
  );

  await runWithContext({ userId: 'uA', tenantId: tenantA.id }, async () => {
    const visible = await prisma.client.findMany({});
    assert('findMany only returns own tenant rows', visible.every((c) => c.tenantId === tenantA.id));
    assert('other tenant rows are not visible', !visible.some((c) => c.id === clientB.id));
    const cross = await prisma.client.findUnique({ where: { id: clientB.id } });
    assert('cross-tenant findUnique returns null', cross === null);
  });

  let failedClosed = false;
  await runWithContext({ userId: 'noTenant' }, async () => {
    try {
      await prisma.client.findMany({});
    } catch {
      failedClosed = true;
    }
  });
  assert('authenticated request without tenant fails closed', failedClosed);

  // cleanup
  await prisma.auditLog.deleteMany({ where: { resourceId: { in: [clientA.id, clientB.id] } } });
  await prisma.$executeRawUnsafe('DELETE FROM clients WHERE id IN ($1, $2)', clientA.id, clientB.id);
  await prisma.$executeRawUnsafe('DELETE FROM tenants WHERE id IN ($1, $2)', tenantA.id, tenantB.id);
}

main()
  .catch((e) => {
    console.error('validation error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });

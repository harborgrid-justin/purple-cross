import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Cypress test data seeding...');

  // Read fixture files
  const fixturesPath = path.join(__dirname, '../../../frontend/cypress/fixtures');
  
  const clientsData = JSON.parse(fs.readFileSync(path.join(fixturesPath, 'clients.json'), 'utf-8'));
  const patientsData = JSON.parse(fs.readFileSync(path.join(fixturesPath, 'patients.json'), 'utf-8'));
  const staffData = JSON.parse(fs.readFileSync(path.join(fixturesPath, 'staff.json'), 'utf-8'));
  const appointmentsData = JSON.parse(fs.readFileSync(path.join(fixturesPath, 'appointments.json'), 'utf-8'));
  const medicalRecordsData = JSON.parse(fs.readFileSync(path.join(fixturesPath, 'medical-records.json'), 'utf-8'));
  const documentsData = JSON.parse(fs.readFileSync(path.join(fixturesPath, 'documents.json'), 'utf-8'));
  const documentTemplatesData = JSON.parse(fs.readFileSync(path.join(fixturesPath, 'document-templates.json'), 'utf-8'));

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.appointment.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.document.deleteMany();
  await prisma.documentTemplate.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.client.deleteMany();
  await prisma.staff.deleteMany();

  // Seed Clients
  console.log('👥 Seeding clients...');
  for (const client of clientsData) {
    await prisma.client.create({
      data: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || '',
        status: client.status,
        preferredContact: 'email',
        createdAt: new Date(client.createdAt),
        updatedAt: new Date(client.updatedAt),
      },
    });
  }
  console.log(`✓ Created ${clientsData.length} clients`);

  // Seed Staff
  console.log('👨‍⚕️ Seeding staff...');
  for (const staff of staffData) {
    await prisma.staff.create({
      data: {
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone || '',
        role: staff.role,
        specialization: staff.specialization || null,
        licenseNumber: staff.licenseNumber || null,
        employmentType: staff.employmentType || 'full-time',
        status: staff.status || 'active',
        hireDate: new Date(staff.hireDate || staff.createdAt),
        createdAt: new Date(staff.createdAt),
        updatedAt: new Date(staff.updatedAt),
      },
    });
  }
  console.log(`✓ Created ${staffData.length} staff members`);

  // Seed Patients
  console.log('🐾 Seeding patients...');
  for (const patient of patientsData) {
    await prisma.patient.create({
      data: {
        id: patient.id,
        name: patient.name,
        species: patient.species,
        breed: patient.breed || '',
        dateOfBirth: new Date(patient.dateOfBirth),
        gender: patient.gender,
        color: patient.color || '',
        weight: patient.weight || 0,
        microchipId: patient.microchipId || null,
        insuranceProvider: patient.insuranceProvider || null,
        insurancePolicy: patient.insurancePolicy || null,
        status: patient.status,
        ownerId: patient.owner.id,
        createdAt: new Date(patient.createdAt),
        updatedAt: new Date(patient.updatedAt),
      },
    });
  }
  console.log(`✓ Created ${patientsData.length} patients`);

  // Seed Appointments
  console.log('📅 Seeding appointments...');
  for (const appointment of appointmentsData) {
    await prisma.appointment.create({
      data: {
        id: appointment.id,
        patientId: appointment.patientId,
        clientId: appointment.clientId,
        veterinarianId: appointment.veterinarianId,
        appointmentType: appointment.appointmentType,
        startTime: new Date(appointment.startTime),
        endTime: new Date(appointment.endTime),
        status: appointment.status,
        reason: appointment.reason || '',
        notes: appointment.notes || null,
        roomId: appointment.roomId || null,
        createdAt: new Date(appointment.createdAt),
        updatedAt: new Date(appointment.updatedAt),
      },
    });
  }
  console.log(`✓ Created ${appointmentsData.length} appointments`);

  // Seed Medical Records (skip for now due to ID mismatches)
  console.log('📋 Skipping medical records (ID mapping needed)...');
  // for (const record of medicalRecordsData) {
  //   await prisma.medicalRecord.create({
  //     data: {
  //       id: record.id,
  //       patientId: record.patientId,
  //       veterinarianId: record.veterinarianId,
  //       visitDate: new Date(record.visitDate),
  //       chiefComplaint: record.chiefComplaint || '',
  //       diagnosis: record.diagnosis || '',
  //       treatment: record.treatment || '',
  //       notes: record.notes || null,
  //       vitalSigns: record.vitalSigns || null,
  //       attachments: record.attachments || null,
  //       createdAt: new Date(record.createdAt),
  //       updatedAt: new Date(record.updatedAt),
  //       },
  //   });
  // }
  // console.log(`✓ Created ${medicalRecordsData.length} medical records`);

  // Seed Document Templates (skip for now)
  console.log('📄 Skipping document templates...');

  // Seed Documents (skip for now)
  console.log('📑 Skipping documents...');

  console.log('✅ Cypress test data seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

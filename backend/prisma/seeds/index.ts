import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if data already exists
  const patientCount = await prisma.patient.count();
  if (patientCount > 0) {
    console.log('📊 Database already contains data. Skipping seed.');
    return;
  }

  console.log('📝 Seeding sample data...');

  // Create sample client
  const client = await prisma.client.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0100',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      preferredContact: 'email',
      status: 'active',
    },
  });

  console.log('✓ Created sample client:', client.email);

  // Create sample patient
  const patient = await prisma.patient.create({
    data: {
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      dateOfBirth: new Date('2020-01-15'),
      gender: 'Male',
      color: 'Golden',
      weight: 65.0,
      ownerId: client.id,
      status: 'active',
    },
  });

  console.log('✓ Created sample patient:', patient.name);

  // Create sample staff member
  const staff = await prisma.staff.create({
    data: {
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@purplecross.vet',
      phone: '+1-555-0101',
      role: 'Veterinarian',
      specialization: 'General Practice',
      licenseNumber: 'VET-12345',
      licenseExpiry: new Date('2025-12-31'),
      employmentType: 'Full-time',
      hireDate: new Date('2023-01-01'),
      status: 'active',
    },
  });

  console.log('✓ Created sample staff member:', staff.email);

  // Create sample medication
  const medication = await prisma.medication.create({
    data: {
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      dosageForm: 'Tablet',
      strength: '500mg',
      manufacturer: 'Generic Pharma',
      controlled: false,
    },
  });

  console.log('✓ Created sample medication:', medication.name);

  // Create sample inventory item
  const inventoryItem = await prisma.inventoryItem.create({
    data: {
      itemType: 'Medication',
      name: 'Amoxicillin 500mg',
      sku: 'MED-AMX-500',
      category: 'Medications',
      medicationId: medication.id,
      quantityOnHand: 100,
      minimumQuantity: 20,
      reorderPoint: 30,
      unitCost: 0.5,
      sellingPrice: 2.0,
      status: 'active',
    },
  });

  console.log('✓ Created sample inventory item:', inventoryItem.name);

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('  - Clients: 1');
  console.log('  - Patients: 1');
  console.log('  - Staff: 1');
  console.log('  - Medications: 1');
  console.log('  - Inventory Items: 1');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

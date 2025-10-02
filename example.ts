/**
 * Purple Cross - Usage Example
 * Demonstrates the comprehensive enterprise platform functionality
 */

import {
  getPlatformInfo,
  getAvailableModules,
  isModuleAvailable,
  Patient,
  Client,
  Appointment,
  MedicalRecord,
  Prescription,
  Invoice,
  LabOrder,
  Employee
} from './src/index';

// Display platform information
console.log('=== Purple Cross Platform ===');
const platformInfo = getPlatformInfo();
console.log(`Name: ${platformInfo.name}`);
console.log(`Version: ${platformInfo.version}`);
console.log(`Description: ${platformInfo.description}`);
console.log(`Total Modules: ${platformInfo.modules}`);
console.log(`Total Sub-Features: ${platformInfo.subFeatures}`);
console.log('');

// List all available modules
console.log('=== Available Modules ===');
const modules = getAvailableModules();
modules.forEach((module, index) => {
  console.log(`${index + 1}. ${module}`);
});
console.log('');

// Check if specific modules are available
console.log('=== Module Availability Check ===');
console.log(`Patient Management: ${isModuleAvailable('Patient (Pet) Management System')}`);
console.log(`Billing System: ${isModuleAvailable('Billing & Payment Processing')}`);
console.log(`Telemedicine: ${isModuleAvailable('Communication & Messaging')}`);
console.log('');

// Example: Create a patient record
console.log('=== Example Usage ===');

const examplePatient: Patient = {
  id: 'PAT001',
  name: 'Max',
  species: 'Dog',
  breed: 'Golden Retriever',
  dateOfBirth: new Date('2020-05-15'),
  gender: 'male',
  weight: 30,
  weightUnit: 'kg',
  color: 'Golden',
  markings: 'White chest patch',
  microchipId: 'MC123456789',
  ownerId: 'CLT001',
  status: 'active',
  photos: ['photo1.jpg', 'photo2.jpg'],
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log('Patient Record Created:');
console.log(`  Name: ${examplePatient.name}`);
console.log(`  Species: ${examplePatient.species}`);
console.log(`  Breed: ${examplePatient.breed}`);
console.log(`  Owner ID: ${examplePatient.ownerId}`);
console.log('');

// Example: Create a client record
const exampleClient: Client = {
  id: 'CLT001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1-555-0123',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'USA'
  },
  preferredContactMethod: 'email',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log('Client Record Created:');
console.log(`  Name: ${exampleClient.firstName} ${exampleClient.lastName}`);
console.log(`  Email: ${exampleClient.email}`);
console.log(`  Phone: ${exampleClient.phoneNumber}`);
console.log('');

// Example: Create an appointment
const exampleAppointment: Appointment = {
  id: 'APT001',
  patientId: 'PAT001',
  clientId: 'CLT001',
  appointmentType: 'Annual Checkup',
  startTime: new Date('2024-10-15T10:00:00'),
  endTime: new Date('2024-10-15T10:30:00'),
  duration: 30,
  status: 'scheduled',
  veterinarianId: 'VET001',
  notes: 'Annual wellness examination',
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log('Appointment Scheduled:');
console.log(`  Type: ${exampleAppointment.appointmentType}`);
console.log(`  Date: ${exampleAppointment.startTime.toLocaleDateString()}`);
console.log(`  Time: ${exampleAppointment.startTime.toLocaleTimeString()}`);
console.log(`  Duration: ${exampleAppointment.duration} minutes`);
console.log('');

console.log('=== Platform Features ===');
console.log('✅ 15 Primary Enterprise Modules');
console.log('✅ 120 Comprehensive Sub-Features');
console.log('✅ 200+ TypeScript Type Definitions');
console.log('✅ HIPAA-Equivalent Compliance');
console.log('✅ Enterprise-Grade Architecture');
console.log('✅ Mobile & Remote Access');
console.log('✅ API & Integration Management');
console.log('');

console.log('Purple Cross - Empowering veterinary professionals with enterprise-grade technology.');

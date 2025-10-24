/**
 * WF-COMP-XXX | fixtures.ts - Test Fixtures
 * Purpose: Mock data fixtures for testing
 * Dependencies: None
 * Last Updated: 2025-10-24 | File Type: .ts
 */

/**
 * Mock patient data
 */
export const mockPatient = {
  id: '1',
  name: 'Buddy',
  species: 'Dog',
  breed: 'Golden Retriever',
  dateOfBirth: '2020-01-15',
  gender: 'Male',
  color: 'Golden',
  weight: 32.5,
  microchipNumber: '123456789012345',
  status: 'active',
  clientId: '1',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockPatients = [
  mockPatient,
  {
    id: '2',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Siamese',
    dateOfBirth: '2019-05-20',
    gender: 'Female',
    color: 'Cream',
    weight: 4.2,
    microchipNumber: '987654321098765',
    status: 'active',
    clientId: '1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    dateOfBirth: '2018-03-10',
    gender: 'Male',
    color: 'Black and Tan',
    weight: 38.0,
    status: 'inactive',
    clientId: '2',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

/**
 * Mock client data
 */
export const mockClient = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-0100',
  address: '123 Main St',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
  status: 'active',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockClients = [
  mockClient,
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-0200',
    address: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62702',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

/**
 * Mock appointment data
 */
export const mockAppointment = {
  id: '1',
  patientId: '1',
  clientId: '1',
  staffId: '1',
  appointmentType: 'checkup',
  startTime: '2025-10-25T10:00:00Z',
  endTime: '2025-10-25T10:30:00Z',
  status: 'scheduled',
  notes: 'Annual wellness exam',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockAppointments = [
  mockAppointment,
  {
    id: '2',
    patientId: '2',
    clientId: '1',
    staffId: '1',
    appointmentType: 'surgery',
    startTime: '2025-10-25T14:00:00Z',
    endTime: '2025-10-25T15:00:00Z',
    status: 'confirmed',
    notes: 'Spay procedure',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

/**
 * Mock medical record data
 */
export const mockMedicalRecord = {
  id: '1',
  patientId: '1',
  staffId: '1',
  visitDate: '2025-10-20',
  chiefComplaint: 'Annual checkup',
  diagnosis: 'Healthy',
  treatment: 'Vaccinations administered',
  prescriptions: [],
  labTests: [],
  status: 'completed',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockMedicalRecords = [
  mockMedicalRecord,
  {
    id: '2',
    patientId: '1',
    staffId: '1',
    visitDate: '2025-09-15',
    chiefComplaint: 'Ear infection',
    diagnosis: 'Otitis externa',
    treatment: 'Antibiotic ear drops',
    prescriptions: ['1'],
    labTests: [],
    status: 'completed',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

/**
 * Mock prescription data
 */
export const mockPrescription = {
  id: '1',
  patientId: '1',
  medicationName: 'Amoxicillin',
  dosage: '250mg',
  frequency: 'Twice daily',
  duration: '10 days',
  instructions: 'Give with food',
  prescribedBy: '1',
  status: 'active',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

/**
 * Mock staff data
 */
export const mockStaff = {
  id: '1',
  firstName: 'Dr. Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@purplecross.com',
  phone: '555-0300',
  role: 'veterinarian',
  specialty: 'General Practice',
  licenseNumber: 'VET-12345',
  status: 'active',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

/**
 * Mock invoice data
 */
export const mockInvoice = {
  id: '1',
  clientId: '1',
  patientId: '1',
  invoiceNumber: 'INV-2025-001',
  invoiceDate: '2025-10-20',
  dueDate: '2025-11-20',
  subtotal: 150.0,
  tax: 12.0,
  total: 162.0,
  amountPaid: 0.0,
  status: 'unpaid',
  items: [
    {
      description: 'Annual wellness exam',
      quantity: 1,
      unitPrice: 100.0,
      total: 100.0,
    },
    {
      description: 'Rabies vaccination',
      quantity: 1,
      unitPrice: 50.0,
      total: 50.0,
    },
  ],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

/**
 * Mock inventory item data
 */
export const mockInventoryItem = {
  id: '1',
  name: 'Amoxicillin 250mg',
  category: 'Medication',
  sku: 'MED-001',
  quantity: 100,
  reorderLevel: 20,
  unitPrice: 2.5,
  supplier: 'VetSupply Co',
  expirationDate: '2026-12-31',
  status: 'active',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

/**
 * Mock lab test data
 */
export const mockLabTest = {
  id: '1',
  patientId: '1',
  testType: 'Blood panel',
  testDate: '2025-10-20',
  results: 'All values within normal range',
  status: 'completed',
  priority: 'routine',
  orderedBy: '1',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

/**
 * Mock document data
 */
export const mockDocument = {
  id: '1',
  patientId: '1',
  clientId: '1',
  title: 'Vaccination Certificate',
  documentType: 'Certificate',
  fileName: 'vaccination-cert.pdf',
  fileSize: 245678,
  mimeType: 'application/pdf',
  uploadedBy: '1',
  status: 'signed',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

/**
 * Mock user data
 */
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'veterinarian',
  token: 'mock-jwt-token',
};

/**
 * Mock API response
 */
export const mockApiResponse = <T>(data: T) => ({
  status: 'success',
  data,
});

/**
 * Mock API error response
 */
export const mockApiError = (message: string, statusCode = 400) => ({
  status: 'error',
  message,
  statusCode,
});

/**
 * Mock pagination metadata
 */
export const mockPagination = {
  page: 1,
  limit: 10,
  total: 100,
  totalPages: 10,
};

/**
 * Generate mock list with pagination
 */
export const mockPaginatedResponse = <T>(
  data: T[],
  page = 1,
  limit = 10,
  total?: number
) => ({
  status: 'success',
  data,
  pagination: {
    page,
    limit,
    total: total || data.length,
    totalPages: Math.ceil((total || data.length) / limit),
  },
});

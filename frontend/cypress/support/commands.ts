/// <reference types="cypress" />

// ***********************************************
// Custom commands for patient management testing
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to navigate to patients page
       * @example cy.visitPatients()
       */
      visitPatients(): Chainable<void>;

      /**
       * Custom command to navigate to a specific patient subpage
       * @param subpage - The patient subpage to navigate to
       * @example cy.visitPatientsPage('registration')
       */
      visitPatientsPage(subpage: string): Chainable<void>;

      /**
       * Custom command to search for patients
       * @param searchTerm - The search term to use
       * @example cy.searchPatients('Buddy')
       */
      searchPatients(searchTerm: string): Chainable<void>;

      /**
       * Custom command to mock patient data
       * @param patients - Array of patient objects
       * @example cy.mockPatients([{ id: '1', name: 'Buddy', species: 'Dog' }])
       */
      mockPatients(patients: unknown[]): Chainable<void>;

      /**
       * Custom command to mock a single patient
       * @param patient - Patient object
       * @example cy.mockPatient({ id: '1', name: 'Buddy', species: 'Dog' })
       */
      mockPatient(patient: unknown): Chainable<void>;

      /**
       * Custom command to mock clients (owners)
       * @param clients - Array of client objects
       * @example cy.mockClients([{ id: '1', firstName: 'John', lastName: 'Doe' }])
       */
      mockClients(clients: unknown[]): Chainable<void>;

      /**
       * Custom command to wait for patient API calls
       * @example cy.waitForPatients()
       */
      waitForPatients(): Chainable<void>;

      /**
       * Custom command to navigate to medical records page
       * @example cy.visitMedicalRecords()
       */
      visitMedicalRecords(): Chainable<void>;

      /**
       * Custom command to navigate to a specific medical records subpage
       * @param subpage - The medical records subpage to navigate to
       * @example cy.visitMedicalRecordsPage('emr')
       */
      visitMedicalRecordsPage(subpage: string): Chainable<void>;

      /**
       * Custom command to mock medical records data
       * @param records - Array of medical record objects
       * @example cy.mockMedicalRecords([{ id: '1', patientId: '1', visitDate: '2024-01-15' }])
       */
      mockMedicalRecords(records: unknown[]): Chainable<void>;

      /**
       * Custom command to mock a single medical record
       * @param record - Medical record object
       * @example cy.mockMedicalRecord({ id: '1', patientId: '1', visitDate: '2024-01-15' })
       */
      mockMedicalRecord(record: unknown): Chainable<void>;

      /**
       * Custom command to wait for medical records API calls
       * @example cy.waitForMedicalRecords()
       */
      waitForMedicalRecords(): Chainable<void>;

      /**
       * Custom command to navigate to documents page
       * @example cy.visitDocuments()
       */
      visitDocuments(): Chainable<void>;

      /**
       * Custom command to navigate to a specific documents subpage
       * @param subpage - The documents subpage to navigate to
       * @example cy.visitDocumentsPage('storage')
       */
      visitDocumentsPage(subpage: string): Chainable<void>;

      /**
       * Custom command to mock documents data
       * @param documents - Array of document objects
       * @example cy.mockDocuments([{ id: '1', title: 'Consent Form', category: 'consent-forms' }])
       */
      mockDocuments(documents: unknown[]): Chainable<void>;

      /**
       * Custom command to mock a single document
       * @param document - Document object
       * @example cy.mockDocument({ id: '1', title: 'Consent Form', category: 'consent-forms' })
       */
      mockDocument(document: unknown): Chainable<void>;

      /**
       * Custom command to mock document templates
       * @param templates - Array of document template objects
       * @example cy.mockDocumentTemplates([{ id: '1', name: 'Surgical Consent', category: 'consent-forms' }])
       */
      mockDocumentTemplates(templates: unknown[]): Chainable<void>;

      /**
       * Custom command to wait for documents API calls
       * @example cy.waitForDocuments()
       */
      waitForDocuments(): Chainable<void>;

      /**
       * Custom command to navigate to staff page
       * @example cy.visitStaff()
       */
      visitStaff(): Chainable<void>;

      /**
       * Custom command to navigate to a specific staff subpage
       * @param subpage - The staff subpage to navigate to
       * @example cy.visitStaffPage('profiles')
       */
      visitStaffPage(subpage: string): Chainable<void>;

      /**
       * Custom command to search for staff members
       * @param searchTerm - The search term to use
       * @example cy.searchStaff('Emily')
       */
      searchStaff(searchTerm: string): Chainable<void>;

      /**
       * Custom command to mock staff data
       * @param staff - Array of staff objects
       * @example cy.mockStaff([{ id: '1', firstName: 'Emily', lastName: 'Smith', role: 'Veterinarian' }])
       */
      mockStaff(staff: unknown[]): Chainable<void>;

      /**
       * Custom command to mock a single staff member
       * @param staffMember - Staff object
       * @example cy.mockStaffMember({ id: '1', firstName: 'Emily', lastName: 'Smith', role: 'Veterinarian' })
       */
      mockStaffMember(staffMember: unknown): Chainable<void>;

      /**
       * Custom command to wait for staff API calls
       * @example cy.waitForStaff()
       */
      waitForStaff(): Chainable<void>;

      /**
       * Custom command to navigate to appointments page
       * @example cy.visitAppointments()
       */
      visitAppointments(): Chainable<void>;

      /**
       * Custom command to navigate to a specific appointments subpage
       * @param subpage - The appointments subpage to navigate to
       * @example cy.visitAppointmentsPage('scheduling')
       */
      visitAppointmentsPage(subpage: string): Chainable<void>;

      /**
       * Custom command to search for appointments
       * @param searchTerm - The search term to use
       * @example cy.searchAppointments('Buddy')
       */
      searchAppointments(searchTerm: string): Chainable<void>;

      /**
       * Custom command to mock appointments data
       * @param appointments - Array of appointment objects
       * @example cy.mockAppointments([{ id: '1', patientId: '1', startTime: '2024-01-20T09:00:00.000Z' }])
       */
      mockAppointments(appointments: unknown[]): Chainable<void>;

      /**
       * Custom command to mock a single appointment
       * @param appointment - Appointment object
       * @example cy.mockAppointment({ id: '1', patientId: '1', startTime: '2024-01-20T09:00:00.000Z' })
       */
      mockAppointment(appointment: unknown): Chainable<void>;

      /**
       * Custom command to wait for appointments API calls
       * @example cy.waitForAppointments()
       */
      waitForAppointments(): Chainable<void>;
    }
  }
}

// Navigate to patients page
Cypress.Commands.add('visitPatients', () => {
  cy.visit('/patients');
});

// Navigate to a specific patient subpage
Cypress.Commands.add('visitPatientsPage', (subpage: string) => {
  cy.visit(`/patients/${subpage}`);
});

// Search for patients
Cypress.Commands.add('searchPatients', (searchTerm: string) => {
  cy.get('input[id="patient-search"]').clear().type(searchTerm);
});

// Mock patient data
Cypress.Commands.add('mockPatients', (patients: unknown[]) => {
  cy.intercept('GET', '/api/patients*', {
    statusCode: 200,
    body: {
      status: 'success',
      data: patients,
    },
  }).as('getPatientsData');
});

// Mock a single patient
Cypress.Commands.add('mockPatient', (patient: unknown) => {
  const patientId = (patient as { id: string }).id;
  cy.intercept('GET', `/api/patients/${patientId}`, {
    statusCode: 200,
    body: {
      status: 'success',
      data: patient,
    },
  }).as('getPatientData');
});

// Mock clients data
Cypress.Commands.add('mockClients', (clients: unknown[]) => {
  cy.intercept('GET', '/api/clients*', {
    statusCode: 200,
    body: {
      status: 'success',
      data: clients,
    },
  }).as('getClientsData');
});

// Wait for patient API calls
Cypress.Commands.add('waitForPatients', () => {
  cy.wait('@getPatients');
});

// Navigate to medical records page
Cypress.Commands.add('visitMedicalRecords', () => {
  cy.visit('/medical-records');
});

// Navigate to a specific medical records subpage
Cypress.Commands.add('visitMedicalRecordsPage', (subpage: string) => {
  cy.visit(`/medical-records/${subpage}`);
});

// Mock medical records data
Cypress.Commands.add('mockMedicalRecords', (records: unknown[]) => {
  cy.intercept('GET', '/api/medical-records*', {
    statusCode: 200,
    body: {
      status: 'success',
      data: records,
    },
  }).as('getMedicalRecordsData');
});

// Mock a single medical record
Cypress.Commands.add('mockMedicalRecord', (record: unknown) => {
  const recordId = (record as { id: string }).id;
  cy.intercept('GET', `/api/medical-records/${recordId}`, {
    statusCode: 200,
    body: {
      status: 'success',
      data: record,
    },
  }).as('getMedicalRecordData');
});

// Wait for medical records API calls
Cypress.Commands.add('waitForMedicalRecords', () => {
  cy.wait('@getMedicalRecords');
});

// Navigate to documents page
Cypress.Commands.add('visitDocuments', () => {
  cy.visit('/documents');
});

// Navigate to a specific documents subpage
Cypress.Commands.add('visitDocumentsPage', (subpage: string) => {
  cy.visit(`/documents/${subpage}`);
});

// Mock documents data
Cypress.Commands.add('mockDocuments', (documents: unknown[]) => {
  cy.intercept('GET', '/api/documents*', {
    statusCode: 200,
    body: {
      status: 'success',
      data: documents,
    },
  }).as('getDocumentsData');
});

// Mock a single document
Cypress.Commands.add('mockDocument', (document: unknown) => {
  const documentId = (document as { id: string }).id;
  cy.intercept('GET', `/api/documents/${documentId}`, {
    statusCode: 200,
    body: {
      status: 'success',
      data: document,
    },
  }).as('getDocumentData');
});

// Mock document templates
Cypress.Commands.add('mockDocumentTemplates', (templates: unknown[]) => {
  cy.intercept('GET', '/api/document-templates*', {
    statusCode: 200,
    body: {
      status: 'success',
      items: templates,
    },
  }).as('getDocumentTemplatesData');
});

// Wait for documents API calls
Cypress.Commands.add('waitForDocuments', () => {
  cy.wait('@getDocuments');
});

// Navigate to staff page
Cypress.Commands.add('visitStaff', () => {
  cy.visit('/staff');
});

// Navigate to a specific staff subpage
Cypress.Commands.add('visitStaffPage', (subpage: string) => {
  cy.visit(`/staff/${subpage}`);
});

// Search for staff members
Cypress.Commands.add('searchStaff', (searchTerm: string) => {
  cy.get('input[id="staff-search"]').clear().type(searchTerm);
});

// Mock staff data
Cypress.Commands.add('mockStaff', (staff: unknown[]) => {
  cy.intercept('GET', '/api/staff*', {
    statusCode: 200,
    body: {
      status: 'success',
      data: staff,
    },
  }).as('getStaffData');
});

// Mock a single staff member
Cypress.Commands.add('mockStaffMember', (staffMember: unknown) => {
  const staffId = (staffMember as { id: string }).id;
  cy.intercept('GET', `/api/staff/${staffId}`, {
    statusCode: 200,
    body: {
      status: 'success',
      data: staffMember,
    },
  }).as('getStaffMemberData');
});

// Wait for staff API calls
Cypress.Commands.add('waitForStaff', () => {
  cy.wait('@getStaff');
});

// Navigate to appointments page
Cypress.Commands.add('visitAppointments', () => {
  cy.visit('/appointments');
});

// Navigate to a specific appointments subpage
Cypress.Commands.add('visitAppointmentsPage', (subpage: string) => {
  cy.visit(`/appointments/${subpage}`);
});

// Search for appointments
Cypress.Commands.add('searchAppointments', (searchTerm: string) => {
  cy.get('input[id="appointment-search"]').clear().type(searchTerm);
});

// Mock appointments data
Cypress.Commands.add('mockAppointments', (appointments: unknown[]) => {
  cy.intercept('GET', '/api/appointments*', {
    statusCode: 200,
    body: {
      status: 'success',
      data: appointments,
    },
  }).as('getAppointmentsData');
});

// Mock a single appointment
Cypress.Commands.add('mockAppointment', (appointment: unknown) => {
  const appointmentId = (appointment as { id: string }).id;
  cy.intercept('GET', `/api/appointments/${appointmentId}`, {
    statusCode: 200,
    body: {
      status: 'success',
      data: appointment,
    },
  }).as('getAppointmentData');
});

// Wait for appointments API calls
Cypress.Commands.add('waitForAppointments', () => {
  cy.wait('@getAppointments');
});

export {};

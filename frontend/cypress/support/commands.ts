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

export {};

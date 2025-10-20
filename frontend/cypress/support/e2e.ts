// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Seed database before running any tests
before(() => {
  cy.task('seedDatabase');
});

// Configure global test settings
beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage();
  
  // Set up API interceptors for common endpoints (for aliasing only, not mocking)
  cy.intercept('GET', '/api/v1/patients*').as('getPatients');
  cy.intercept('POST', '/api/v1/patients').as('createPatient');
  cy.intercept('PUT', '/api/v1/patients/*').as('updatePatient');
  cy.intercept('DELETE', '/api/v1/patients/*').as('deletePatient');
  cy.intercept('GET', '/api/v1/clients*').as('getClients');
  cy.intercept('GET', '/api/v1/appointments*').as('getAppointments');
  cy.intercept('POST', '/api/v1/appointments').as('createAppointment');
  cy.intercept('PUT', '/api/v1/appointments/*').as('updateAppointment');
  cy.intercept('DELETE', '/api/v1/appointments/*').as('deleteAppointment');
  cy.intercept('GET', '/api/v1/staff*').as('getStaff');
  cy.intercept('GET', '/api/v1/medical-records*').as('getMedicalRecords');
  cy.intercept('POST', '/api/v1/medical-records').as('createMedicalRecord');
  cy.intercept('PUT', '/api/v1/medical-records/*').as('updateMedicalRecord');
  cy.intercept('DELETE', '/api/v1/medical-records/*').as('deleteMedicalRecord');
  cy.intercept('GET', '/api/v1/documents*').as('getDocuments');
  cy.intercept('POST', '/api/v1/documents').as('createDocument');
});

// Prevent Cypress from failing tests on uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You may want to log the error for debugging
  console.error('Uncaught exception:', err);
  return false;
});

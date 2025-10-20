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

// Configure global test settings
beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage();
  
  // Set up API interceptors for common endpoints
  cy.intercept('GET', '/api/patients*').as('getPatients');
  cy.intercept('POST', '/api/patients').as('createPatient');
  cy.intercept('PUT', '/api/patients/*').as('updatePatient');
  cy.intercept('DELETE', '/api/patients/*').as('deletePatient');
  cy.intercept('GET', '/api/clients*').as('getClients');
  cy.intercept('GET', '/api/medical-records*').as('getMedicalRecords');
  cy.intercept('POST', '/api/medical-records').as('createMedicalRecord');
  cy.intercept('PUT', '/api/medical-records/*').as('updateMedicalRecord');
  cy.intercept('DELETE', '/api/medical-records/*').as('deleteMedicalRecord');
});

// Prevent Cypress from failing tests on uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You may want to log the error for debugging
  console.error('Uncaught exception:', err);
  return false;
});

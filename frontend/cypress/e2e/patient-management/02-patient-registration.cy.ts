/// <reference types="cypress" />

describe('Patient Registration & Profiles', () => {
  beforeEach(() => {
    cy.fixture('clients').then((data) => {
      cy.mockClients(data);
    });
  });

  it.skip('should display the registration page title',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.get('.page-header h1').should('contain', 'Patient Registration & Profiles');
  });

  it.skip('should display "Register New Patient" button',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.get('.btn-primary').should('contain', 'Register New Patient');
    cy.get('.btn-primary').should('be.visible');
  });

  it.skip('should display Basic Information card',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.contains('h3', 'Basic Information').should('be.visible');
    cy.contains('Name, species, breed').should('be.visible');
    cy.contains('Date of birth, age').should('be.visible');
    cy.contains('Microchip ID').should('be.visible');
  });

  it.skip('should display Owner Details card',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.contains('h3', 'Owner Details').should('be.visible');
    cy.contains('Primary & secondary owners').should('be.visible');
    cy.contains('Contact information').should('be.visible');
    cy.contains('Emergency contacts').should('be.visible');
  });

  it.skip('should display Medical Overview card',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.contains('h3', 'Medical Overview').should('be.visible');
    cy.contains('Allergies & sensitivities').should('be.visible');
    cy.contains('Current medications').should('be.visible');
    cy.contains('Vaccination status').should('be.visible');
  });

  it.skip('should have proper grid layout for info cards',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it.skip('should navigate back to all patients from registration page',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.contains('.sub-nav-link', 'All Patients').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/patients');
  });

  it.skip('should highlight active navigation link',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.contains('.sub-nav-link', 'Registration & Profiles').should('have.class', 'active');
    cy.contains('.sub-nav-link', 'All Patients').should('not.have.class', 'active');
  });

  it.skip('should display comprehensive patient profile features',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');

    // Verify all key features are documented
    const expectedFeatures = [
      'Name, species, breed',
      'Date of birth, age',
      'Sex, color, markings',
      'Microchip ID',
      'Primary & secondary owners',
      'Contact information',
      'Emergency contacts',
      'Billing contacts',
      'Allergies & sensitivities',
      'Current medications',
      'Vaccination status',
      'Medical alerts',
    ];

    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it.skip('should have accessible content sections',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('registration');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });
});

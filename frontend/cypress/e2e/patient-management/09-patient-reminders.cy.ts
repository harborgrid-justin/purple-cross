/// <reference types="cypress" />

describe('Patient Reminders & Alerts', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it.skip('should display the reminders page title', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('reminders');
    cy.get('.page-header h1').should('contain', 'Reminders & Alerts');
  });

  it.skip('should display reminders content', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('reminders');
    cy.get('.content-section').should('exist');
    cy.contains('reminder').should('be.visible');
  });

  it.skip('should navigate to reminders from main patients page', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Reminders & Alerts').click();
    cy.url().should('include', '/patients/reminders');
  });

  it.skip('should highlight reminders in navigation when active', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('reminders');
    cy.contains('.sub-nav-link', 'Reminders & Alerts').should('have.class', 'active');
  });

  it.skip('should have proper page structure', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('reminders');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it.skip('should display patient reminder and alert features', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('reminders');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });

  it.skip('should navigate back to all patients', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('reminders');
    cy.contains('.sub-nav-link', 'All Patients').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/patients');
  });
});

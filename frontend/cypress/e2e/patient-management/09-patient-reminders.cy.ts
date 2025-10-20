/// <reference types="cypress" />

describe('Patient Reminders & Alerts', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it('should display the reminders page title', () => {
    cy.visitPatientsPage('reminders');
    cy.get('.page-header h1').should('contain', 'Reminders & Alerts');
  });

  it('should display reminders content', () => {
    cy.visitPatientsPage('reminders');
    cy.get('.content-section').should('exist');
    cy.contains('reminder').should('be.visible');
  });

  it('should navigate to reminders from main patients page', () => {
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Reminders & Alerts').click();
    cy.url().should('include', '/patients/reminders');
  });

  it('should highlight reminders in navigation when active', () => {
    cy.visitPatientsPage('reminders');
    cy.contains('.sub-nav-link', 'Reminders & Alerts').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitPatientsPage('reminders');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it('should display patient reminder and alert features', () => {
    cy.visitPatientsPage('reminders');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });

  it('should navigate back to all patients', () => {
    cy.visitPatientsPage('reminders');
    cy.contains('.sub-nav-link', 'All Patients').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/patients');
  });
});

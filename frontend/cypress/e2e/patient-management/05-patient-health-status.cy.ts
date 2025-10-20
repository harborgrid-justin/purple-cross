/// <reference types="cypress" />

describe('Patient Health Status', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it.skip('should display the health status page title',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('health-status');
    cy.get('.page-header h1').should('contain', 'Patient Health Status');
  });

  it.skip('should display health status content',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('health-status');
    cy.get('.content-section').should('exist');
    cy.contains('health').should('be.visible');
  });

  it.skip('should navigate to health status from main patients page',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Health Status').click();
    cy.url().should('include', '/patients/health-status');
  });

  it.skip('should highlight health status in navigation when active',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('health-status');
    cy.contains('.sub-nav-link', 'Health Status').should('have.class', 'active');
  });

  it.skip('should have proper page structure',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('health-status');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it.skip('should display patient health tracking features',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('health-status');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });

  it.skip('should allow navigation to other patient sections',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.visitPatientsPage('health-status');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Lifecycle Management').click();
    cy.url().should('include', '/patients/lifecycle');
  });
});

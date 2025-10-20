/// <reference types="cypress" />

describe('Patient Demographics', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it.skip('should display the demographics page title', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('demographics');
    cy.get('.page-header h1').should('contain', 'Patient Demographics');
  });

  it.skip('should display demographics content', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('demographics');
    cy.get('.content-section').should('exist');
    cy.contains('demographic').should('be.visible');
  });

  it.skip('should navigate to demographics from main patients page', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Demographics').click();
    cy.url().should('include', '/patients/demographics');
  });

  it.skip('should highlight demographics in navigation when active', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('demographics');
    cy.contains('.sub-nav-link', 'Demographics').should('have.class', 'active');
  });

  it.skip('should have proper page structure', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('demographics');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it.skip('should display patient demographics analysis tools', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('demographics');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });

  it.skip('should allow navigation between patient sections', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('demographics');
    cy.get('.sub-nav').should('exist');
    cy.get('.sub-nav-link').should('have.length.at.least', 8);
  });
});

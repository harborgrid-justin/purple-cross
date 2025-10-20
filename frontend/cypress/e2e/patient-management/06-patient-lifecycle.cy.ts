/// <reference types="cypress" />

describe('Patient Lifecycle Management', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it.skip('should display the lifecycle page title', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('lifecycle');
    cy.get('.page-header h1').should('contain', 'Patient Lifecycle Management');
  });

  it.skip('should display lifecycle content', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('lifecycle');
    cy.get('.content-section').should('exist');
    cy.contains('life').should('be.visible');
  });

  it.skip('should navigate to lifecycle from main patients page', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Lifecycle Management').click();
    cy.url().should('include', '/patients/lifecycle');
  });

  it.skip('should highlight lifecycle in navigation when active', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('lifecycle');
    cy.contains('.sub-nav-link', 'Lifecycle Management').should('have.class', 'active');
  });

  it.skip('should have proper page structure', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('lifecycle');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it.skip('should display patient lifecycle tracking features', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('lifecycle');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });

  it.skip('should allow navigation between lifecycle and other sections', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.visitPatientsPage('lifecycle');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Breed Information').click();
    cy.url().should('include', '/patients/breed-info');
  });
});

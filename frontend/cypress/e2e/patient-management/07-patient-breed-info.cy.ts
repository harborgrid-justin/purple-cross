/// <reference types="cypress" />

describe('Patient Breed Information', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it.skip('should display the breed information page title', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('breed-info');
    cy.get('.page-header h1').should('contain', 'Breed');
  });

  it.skip('should display breed information content', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('breed-info');
    cy.get('.content-section').should('exist');
    cy.contains('breed').should('be.visible');
  });

  it.skip('should navigate to breed info from main patients page', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Breed Information').click();
    cy.url().should('include', '/patients/breed-info');
  });

  it.skip('should highlight breed info in navigation when active', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('breed-info');
    cy.contains('.sub-nav-link', 'Breed Information').should('have.class', 'active');
  });

  it.skip('should have proper page structure', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('breed-info');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it.skip('should display breed information features', () => {
    // Skipped: Advanced patient management feature not yet fully implemented
    cy.visitPatientsPage('breed-info');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });
});

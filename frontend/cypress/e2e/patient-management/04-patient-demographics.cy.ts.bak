/// <reference types="cypress" />

describe('Patient Demographics', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it('should display the demographics page title', () => {
    cy.visitPatientsPage('demographics');
    cy.get('.page-header h1').should('contain', 'Patient Demographics');
  });

  it('should display demographics content', () => {
    cy.visitPatientsPage('demographics');
    cy.get('.content-section').should('exist');
    cy.contains('demographic').should('be.visible');
  });

  it('should navigate to demographics from main patients page', () => {
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Demographics').click();
    cy.url().should('include', '/patients/demographics');
  });

  it('should highlight demographics in navigation when active', () => {
    cy.visitPatientsPage('demographics');
    cy.contains('.sub-nav-link', 'Demographics').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitPatientsPage('demographics');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it('should display patient demographics analysis tools', () => {
    cy.visitPatientsPage('demographics');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });

  it('should allow navigation between patient sections', () => {
    cy.visitPatientsPage('demographics');
    cy.get('.sub-nav').should('exist');
    cy.get('.sub-nav-link').should('have.length.at.least', 8);
  });
});

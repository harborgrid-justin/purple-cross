/// <reference types="cypress" />

describe('Patient Lifecycle Management', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it('should display the lifecycle page title', () => {
    cy.visitPatientsPage('lifecycle');
    cy.get('.page-header h1').should('contain', 'Patient Lifecycle Management');
  });

  it('should display lifecycle content', () => {
    cy.visitPatientsPage('lifecycle');
    cy.get('.content-section').should('exist');
    cy.contains('life').should('be.visible');
  });

  it('should navigate to lifecycle from main patients page', () => {
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Lifecycle Management').click();
    cy.url().should('include', '/patients/lifecycle');
  });

  it('should highlight lifecycle in navigation when active', () => {
    cy.visitPatientsPage('lifecycle');
    cy.contains('.sub-nav-link', 'Lifecycle Management').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitPatientsPage('lifecycle');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it('should display patient lifecycle tracking features', () => {
    cy.visitPatientsPage('lifecycle');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });

  it('should allow navigation between lifecycle and other sections', () => {
    cy.visitPatientsPage('lifecycle');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Breed Information').click();
    cy.url().should('include', '/patients/breed-info');
  });
});

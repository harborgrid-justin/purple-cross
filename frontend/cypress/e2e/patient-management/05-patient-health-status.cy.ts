/// <reference types="cypress" />

describe('Patient Health Status', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it('should display the health status page title', () => {
    cy.visitPatientsPage('health-status');
    cy.get('.page-header h1').should('contain', 'Patient Health Status');
  });

  it('should display health status content', () => {
    cy.visitPatientsPage('health-status');
    cy.get('.content-section').should('exist');
    cy.contains('health').should('be.visible');
  });

  it('should navigate to health status from main patients page', () => {
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Health Status').click();
    cy.url().should('include', '/patients/health-status');
  });

  it('should highlight health status in navigation when active', () => {
    cy.visitPatientsPage('health-status');
    cy.contains('.sub-nav-link', 'Health Status').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitPatientsPage('health-status');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it('should display patient health tracking features', () => {
    cy.visitPatientsPage('health-status');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });

  it('should allow navigation to other patient sections', () => {
    cy.visitPatientsPage('health-status');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Lifecycle Management').click();
    cy.url().should('include', '/patients/lifecycle');
  });
});

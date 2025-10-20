/// <reference types="cypress" />

describe('Patient Breed Information', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it('should display the breed information page title', () => {
    cy.visitPatientsPage('breed-info');
    cy.get('.page-header h1').should('contain', 'Breed Information');
  });

  it('should display breed information content', () => {
    cy.visitPatientsPage('breed-info');
    cy.get('.content-section').should('exist');
    cy.contains('breed').should('be.visible');
  });

  it('should navigate to breed info from main patients page', () => {
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Breed Information').click();
    cy.url().should('include', '/patients/breed-info');
  });

  it('should highlight breed info in navigation when active', () => {
    cy.visitPatientsPage('breed-info');
    cy.contains('.sub-nav-link', 'Breed Information').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitPatientsPage('breed-info');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it('should display breed information features', () => {
    cy.visitPatientsPage('breed-info');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });
});

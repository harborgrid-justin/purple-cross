/// <reference types="cypress" />

describe('Patient Relationships', () => {
  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      cy.mockPatients(data);
    });
  });

  it('should display the relationships page title', () => {
    cy.visitPatientsPage('relationships');
    cy.get('.page-header h1').should('contain', 'Relationship Mapping');
  });

  it('should display relationships content', () => {
    cy.visitPatientsPage('relationships');
    cy.get('.content-section').should('exist');
    cy.contains('relationship').should('be.visible');
  });

  it('should navigate to relationships from main patients page', () => {
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Relationship Mapping').click();
    cy.url().should('include', '/patients/relationships');
  });

  it('should highlight relationships in navigation when active', () => {
    cy.visitPatientsPage('relationships');
    cy.contains('.sub-nav-link', 'Relationship Mapping').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitPatientsPage('relationships');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
  });

  it('should display patient relationship mapping features', () => {
    cy.visitPatientsPage('relationships');
    cy.get('.page').should('be.visible');
    cy.get('h1').should('be.visible');
  });
});

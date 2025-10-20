/// <reference types="cypress" />

describe('Patient Search & Filtering', () => {
  let patients: unknown[];

  beforeEach(() => {
    cy.fixture('patients').then((data) => {
      patients = data;
      cy.mockPatients(data);
    });
  });

  it('should display the search page title', () => {
    cy.visitPatientsPage('search');
    cy.get('.page-header h1').should('contain', 'Patient Search & Filtering');
  });

  it('should display search input field', () => {
    cy.visitPatientsPage('search');
    cy.get('input[type="search"]').should('be.visible');
    cy.get('input[type="search"]').should('have.attr', 'placeholder')
      .and('include', 'Search');
  });

  it('should display "Advanced Filters" button', () => {
    cy.visitPatientsPage('search');
    cy.get('.btn-secondary').should('contain', 'Advanced Filters');
    cy.get('.btn-secondary').should('be.visible');
  });

  it('should display Search Options card', () => {
    cy.visitPatientsPage('search');
    cy.contains('h3', 'Search Options').should('be.visible');
    cy.contains('Name & microchip search').should('be.visible');
    cy.contains('Species & breed filters').should('be.visible');
    cy.contains('Owner name search').should('be.visible');
    cy.contains('Age range filters').should('be.visible');
  });

  it('should display Advanced Filters card', () => {
    cy.visitPatientsPage('search');
    cy.contains('h3', 'Advanced Filters').should('be.visible');
    cy.contains('Medical condition filters').should('be.visible');
    cy.contains('Vaccination status').should('be.visible');
    cy.contains('Last visit date range').should('be.visible');
    cy.contains('Active/inactive status').should('be.visible');
  });

  it('should have proper grid layout for filter cards', () => {
    cy.visitPatientsPage('search');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should have accessible search functionality', () => {
    cy.visitPatientsPage('search');
    cy.get('[role="search"]').should('exist');
  });

  it('should navigate to search page and back', () => {
    cy.visitPatients();
    cy.contains('.sub-nav-link', 'Search & Filtering').click();
    cy.url().should('include', '/patients/search');
    
    cy.contains('.sub-nav-link', 'All Patients').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/patients');
  });

  it('should display comprehensive search features', () => {
    cy.visitPatientsPage('search');
    
    const searchFeatures = [
      'Name & microchip search',
      'Species & breed filters',
      'Owner name search',
      'Age range filters',
      'Medical condition filters',
      'Vaccination status',
      'Last visit date range',
      'Active/inactive status'
    ];
    
    searchFeatures.forEach(feature => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should maintain proper page structure', () => {
    cy.visitPatientsPage('search');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });
});

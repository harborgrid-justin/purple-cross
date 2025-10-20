/// <reference types="cypress" />

describe('Treatment History', () => {
  it('should display the treatment history page title', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.get('.page-header h1').should('contain', 'Treatment History');
  });

  it('should display treatment history content section', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it('should navigate to treatment history from main medical records page', () => {
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'Treatment History').click();
    cy.url().should('include', '/medical-records/treatment-history');
  });

  it('should highlight treatment history in navigation when active', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.contains('.sub-nav-link', 'Treatment History').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display History Tracking card', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.contains('h3', 'History Tracking').should('be.visible');
    cy.contains('All treatments').should('be.visible');
    cy.contains('Chronological view').should('be.visible');
    cy.contains('Provider notes').should('be.visible');
    cy.contains('Outcomes').should('be.visible');
  });

  it('should display Search card', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.contains('h3', 'Search').should('be.visible');
    cy.contains('By date range').should('be.visible');
    cy.contains('By procedure').should('be.visible');
    cy.contains('By provider').should('be.visible');
    cy.contains('By condition').should('be.visible');
  });

  it('should display Analysis card', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.contains('h3', 'Analysis').should('be.visible');
    cy.contains('Treatment effectiveness').should('be.visible');
    cy.contains('Recurring issues').should('be.visible');
    cy.contains('Treatment plans').should('be.visible');
    cy.contains('Follow-up needs').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should display comprehensive treatment history features', () => {
    cy.visitMedicalRecordsPage('treatment-history');

    const expectedFeatures = [
      'All treatments',
      'Chronological view',
      'Provider notes',
      'Outcomes',
      'By date range',
      'By procedure',
      'By provider',
      'By condition',
      'Treatment effectiveness',
      'Recurring issues',
      'Treatment plans',
      'Follow-up needs',
    ];

    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should allow navigation to other medical record sections', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Vital Signs').click();
    cy.url().should('include', '/medical-records/vital-signs');
  });

  it('should navigate back to all records from treatment history page', () => {
    cy.visitMedicalRecordsPage('treatment-history');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

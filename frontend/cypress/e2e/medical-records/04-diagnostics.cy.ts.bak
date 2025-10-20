/// <reference types="cypress" />

describe('Diagnostic Results Tracking', () => {
  it('should display the diagnostics page title', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.get('.page-header h1').should('contain', 'Diagnostic Results Tracking');
  });

  it('should display diagnostics content section', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it('should navigate to diagnostics from main medical records page', () => {
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'Diagnostics').click();
    cy.url().should('include', '/medical-records/diagnostics');
  });

  it('should highlight diagnostics in navigation when active', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.contains('.sub-nav-link', 'Diagnostics').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display Test Types card', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.contains('h3', 'Test Types').should('be.visible');
    cy.contains('Blood work').should('be.visible');
    cy.contains('Urinalysis').should('be.visible');
    cy.contains('Imaging').should('be.visible');
    cy.contains('Biopsies').should('be.visible');
  });

  it('should display Results card', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.contains('h3', 'Results').should('be.visible');
    cy.contains('Lab integration').should('be.visible');
    cy.contains('Result alerts').should('be.visible');
    cy.contains('Trending').should('be.visible');
    cy.contains('Comparisons').should('be.visible');
  });

  it('should display Reporting card', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.contains('h3', 'Reporting').should('be.visible');
    cy.contains('Result summaries').should('be.visible');
    cy.contains('PDF reports').should('be.visible');
    cy.contains('Shareable reports').should('be.visible');
    cy.contains('Historical trends').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should display comprehensive diagnostics features', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    
    const expectedFeatures = [
      'Blood work',
      'Urinalysis',
      'Imaging',
      'Biopsies',
      'Lab integration',
      'Result alerts',
      'Trending',
      'Comparisons',
      'Result summaries',
      'PDF reports',
      'Shareable reports',
      'Historical trends'
    ];
    
    expectedFeatures.forEach(feature => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should allow navigation to other medical record sections', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Treatment History').click();
    cy.url().should('include', '/medical-records/treatment-history');
  });

  it('should navigate back to all records from diagnostics page', () => {
    cy.visitMedicalRecordsPage('diagnostics');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

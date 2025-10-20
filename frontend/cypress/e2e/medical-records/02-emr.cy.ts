/// <reference types="cypress" />

describe('Electronic Medical Records (EMR)', () => {
  it.skip('should display the EMR page title', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.get('.page-header h1').should('contain', 'Electronic Medical Records');
  });

  it.skip('should display EMR content section', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it.skip('should navigate to EMR from main medical records page', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'EMR').click();
    cy.url().should('include', '/medical-records/emr');
  });

  it.skip('should highlight EMR in navigation when active', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.contains('.sub-nav-link', 'EMR').should('have.class', 'active');
  });

  it.skip('should have proper page structure', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it.skip('should display Core Features card', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.contains('h3', 'Core Features').should('be.visible');
    cy.contains('Digital records').should('be.visible');
    cy.contains('Quick access').should('be.visible');
    cy.contains('Secure storage').should('be.visible');
    cy.contains('Version control').should('be.visible');
  });

  it.skip('should display Templates card', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.contains('h3', 'Templates').should('be.visible');
    cy.contains('SOAP notes').should('be.visible');
    cy.contains('Progress notes').should('be.visible');
    cy.contains('Discharge summaries').should('be.visible');
    cy.contains('Referral letters').should('be.visible');
  });

  it.skip('should display Integration card', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.contains('h3', 'Integration').should('be.visible');
    cy.contains('Lab results').should('be.visible');
    cy.contains('Imaging').should('be.visible');
    cy.contains('Prescriptions').should('be.visible');
    cy.contains('Invoices').should('be.visible');
  });

  it.skip('should have proper grid layout for info cards', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it.skip('should display comprehensive EMR features', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');

    const expectedFeatures = [
      'Digital records',
      'Quick access',
      'Secure storage',
      'Version control',
      'SOAP notes',
      'Progress notes',
      'Discharge summaries',
      'Referral letters',
      'Lab results',
      'Imaging',
      'Prescriptions',
      'Invoices',
    ];

    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it.skip('should allow navigation to other medical record sections', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Clinical Notes').click();
    cy.url().should('include', '/medical-records/clinical-notes');
  });

  it.skip('should navigate back to all records from EMR page', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('emr');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

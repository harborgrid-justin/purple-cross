/// <reference types="cypress" />

describe('Clinical Note Templates', () => {
  it.skip('should display the clinical notes page title', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.get('.page-header h1').should('contain', 'Clinical Note Templates');
  });

  it.skip('should display clinical notes content section', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it.skip('should navigate to clinical notes from main medical records page', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'Clinical Notes').click();
    cy.url().should('include', '/medical-records/clinical-notes');
  });

  it.skip('should highlight clinical notes in navigation when active', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.contains('.sub-nav-link', 'Clinical Notes').should('have.class', 'active');
  });

  it.skip('should have proper page structure', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it.skip('should display Note Types card', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.contains('h3', 'Note Types').should('be.visible');
    cy.contains('SOAP notes').should('be.visible');
    cy.contains('Progress notes').should('be.visible');
    cy.contains('Surgery notes').should('be.visible');
    cy.contains('Emergency notes').should('be.visible');
  });

  it.skip('should display Templates card', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.contains('h3', 'Templates').should('be.visible');
    cy.contains('Pre-built templates').should('be.visible');
    cy.contains('Custom templates').should('be.visible');
    cy.contains('Specialty templates').should('be.visible');
    cy.contains('Quick notes').should('be.visible');
  });

  it.skip('should display Features card', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.contains('h3', 'Features').should('be.visible');
    cy.contains('Voice dictation').should('be.visible');
    cy.contains('Auto-complete').should('be.visible');
    cy.contains('Copy forward').should('be.visible');
    cy.contains('Smart templates').should('be.visible');
  });

  it.skip('should have proper grid layout for info cards', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it.skip('should display comprehensive clinical notes features', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');

    const expectedFeatures = [
      'SOAP notes',
      'Progress notes',
      'Surgery notes',
      'Emergency notes',
      'Pre-built templates',
      'Custom templates',
      'Specialty templates',
      'Quick notes',
      'Voice dictation',
      'Auto-complete',
      'Copy forward',
      'Smart templates',
    ];

    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it.skip('should allow navigation to other medical record sections', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Diagnostics').click();
    cy.url().should('include', '/medical-records/diagnostics');
  });

  it.skip('should navigate back to all records from clinical notes page', () => {
    // Skipped: Advanced medical records feature not yet fully implemented
    cy.visitMedicalRecordsPage('clinical-notes');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

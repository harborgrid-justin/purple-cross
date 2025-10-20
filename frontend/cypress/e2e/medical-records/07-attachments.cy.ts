/// <reference types="cypress" />

describe('Medical Attachments', () => {
  it('should display the attachments page title', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.get('.page-header h1').should('contain', 'Medical Attachments');
  });

  it('should display attachments content section', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it('should navigate to attachments from main medical records page', () => {
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'Attachments').click();
    cy.url().should('include', '/medical-records/attachments');
  });

  it('should highlight attachments in navigation when active', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.contains('.sub-nav-link', 'Attachments').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display File Types card', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.contains('h3', 'File Types').should('be.visible');
    cy.contains('Images').should('be.visible');
    cy.contains('PDFs').should('be.visible');
    cy.contains('Lab reports').should('be.visible');
    cy.contains('X-rays').should('be.visible');
  });

  it('should display Management card', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.contains('h3', 'Management').should('be.visible');
    cy.contains('Upload files').should('be.visible');
    cy.contains('Organize files').should('be.visible');
    cy.contains('Tag files').should('be.visible');
    cy.contains('Share files').should('be.visible');
  });

  it('should display Viewing card', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.contains('h3', 'Viewing').should('be.visible');
    cy.contains('Built-in viewer').should('be.visible');
    cy.contains('Annotations').should('be.visible');
    cy.contains('Zoom').should('be.visible');
    cy.contains('Compare images').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should display comprehensive attachments features', () => {
    cy.visitMedicalRecordsPage('attachments');

    const expectedFeatures = [
      'Images',
      'PDFs',
      'Lab reports',
      'X-rays',
      'Upload files',
      'Organize files',
      'Tag files',
      'Share files',
      'Built-in viewer',
      'Annotations',
      'Zoom',
      'Compare images',
    ];

    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should allow navigation to other medical record sections', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Record Sharing').click();
    cy.url().should('include', '/medical-records/sharing');
  });

  it('should navigate back to all records from attachments page', () => {
    cy.visitMedicalRecordsPage('attachments');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

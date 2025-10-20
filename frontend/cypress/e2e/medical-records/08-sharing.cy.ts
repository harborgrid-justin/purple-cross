/// <reference types="cypress" />

describe('Medical Record Sharing', () => {
  it('should display the sharing page title', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.get('.page-header h1').should('contain', 'Medical Record Sharing');
  });

  it('should display sharing content section', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it('should navigate to sharing from main medical records page', () => {
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'Record Sharing').click();
    cy.url().should('include', '/medical-records/sharing');
  });

  it('should highlight sharing in navigation when active', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.contains('.sub-nav-link', 'Record Sharing').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display Sharing Options card', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.contains('h3', 'Sharing Options').should('be.visible');
    cy.contains('Email').should('be.visible');
    cy.contains('Fax').should('be.visible');
    cy.contains('Direct share').should('be.visible');
    cy.contains('Portal access').should('be.visible');
  });

  it('should display Security card', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.contains('h3', 'Security').should('be.visible');
    cy.contains('Encryption').should('be.visible');
    cy.contains('Access logs').should('be.visible');
    cy.contains('Expiration dates').should('be.visible');
    cy.contains('Password protection').should('be.visible');
  });

  it('should display Tracking card', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.contains('h3', 'Tracking').should('be.visible');
    cy.contains('Sent records').should('be.visible');
    cy.contains('Received records').should('be.visible');
    cy.contains('Access history').should('be.visible');
    cy.contains('Audit trail').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should display comprehensive sharing features', () => {
    cy.visitMedicalRecordsPage('sharing');
    
    const expectedFeatures = [
      'Email',
      'Fax',
      'Direct share',
      'Portal access',
      'Encryption',
      'Access logs',
      'Expiration dates',
      'Password protection',
      'Sent records',
      'Received records',
      'Access history',
      'Audit trail'
    ];
    
    expectedFeatures.forEach(feature => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should allow navigation to other medical record sections', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Audit Trail').click();
    cy.url().should('include', '/medical-records/audit');
  });

  it('should navigate back to all records from sharing page', () => {
    cy.visitMedicalRecordsPage('sharing');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

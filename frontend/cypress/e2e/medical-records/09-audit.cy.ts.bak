/// <reference types="cypress" />

describe('Audit Trail & Compliance', () => {
  it('should display the audit trail page title', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.get('.page-header h1').should('contain', 'Audit Trail & Compliance');
  });

  it('should display audit trail content section', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it('should navigate to audit trail from main medical records page', () => {
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'Audit Trail').click();
    cy.url().should('include', '/medical-records/audit');
  });

  it('should highlight audit trail in navigation when active', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.contains('.sub-nav-link', 'Audit Trail').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display Audit Log card', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.contains('h3', 'Audit Log').should('be.visible');
    cy.contains('All changes').should('be.visible');
    cy.contains('User actions').should('be.visible');
    cy.contains('Timestamps').should('be.visible');
    cy.contains('IP addresses').should('be.visible');
  });

  it('should display Compliance card', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.contains('h3', 'Compliance').should('be.visible');
    cy.contains('HIPAA compliance').should('be.visible');
    cy.contains('Data retention').should('be.visible');
    cy.contains('Access controls').should('be.visible');
    cy.contains('Breach detection').should('be.visible');
  });

  it('should display Reporting card', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.contains('h3', 'Reporting').should('be.visible');
    cy.contains('Audit reports').should('be.visible');
    cy.contains('Compliance reports').should('be.visible');
    cy.contains('Security reports').should('be.visible');
    cy.contains('Access reports').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should display comprehensive audit trail features', () => {
    cy.visitMedicalRecordsPage('audit');
    
    const expectedFeatures = [
      'All changes',
      'User actions',
      'Timestamps',
      'IP addresses',
      'HIPAA compliance',
      'Data retention',
      'Access controls',
      'Breach detection',
      'Audit reports',
      'Compliance reports',
      'Security reports',
      'Access reports'
    ];
    
    expectedFeatures.forEach(feature => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should navigate back to all records from audit trail page', () => {
    cy.visitMedicalRecordsPage('audit');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

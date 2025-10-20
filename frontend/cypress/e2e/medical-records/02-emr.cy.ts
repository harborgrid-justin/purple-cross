/// <reference types="cypress" />

describe('Electronic Medical Records (EMR)', () => {
  it('should display the EMR page title', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.get('.page-header h1').should('contain', 'Electronic Medical Records');
  });

  it('should display EMR content section', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it('should navigate to EMR from main medical records page', () => {
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'EMR').click();
    cy.url().should('include', '/medical-records/emr');
  });

  it('should highlight EMR in navigation when active', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.contains('.sub-nav-link', 'EMR').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display Core Features card', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.contains('h3', 'Core Features').should('be.visible');
    cy.contains('Digital records').should('be.visible');
    cy.contains('Quick access').should('be.visible');
    cy.contains('Secure storage').should('be.visible');
    cy.contains('Version control').should('be.visible');
  });

  it('should display Templates card', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.contains('h3', 'Templates').should('be.visible');
    cy.contains('SOAP notes').should('be.visible');
    cy.contains('Progress notes').should('be.visible');
    cy.contains('Discharge summaries').should('be.visible');
    cy.contains('Referral letters').should('be.visible');
  });

  it('should display Integration card', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.contains('h3', 'Integration').should('be.visible');
    cy.contains('Lab results').should('be.visible');
    cy.contains('Imaging').should('be.visible');
    cy.contains('Prescriptions').should('be.visible');
    cy.contains('Invoices').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should display comprehensive EMR features', () => {
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
      'Invoices'
    ];
    
    expectedFeatures.forEach(feature => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should allow navigation to other medical record sections', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Clinical Notes').click();
    cy.url().should('include', '/medical-records/clinical-notes');
  });

  it('should navigate back to all records from EMR page', () => {
    cy.visitMedicalRecordsPage('emr');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

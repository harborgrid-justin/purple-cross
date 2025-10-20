/// <reference types="cypress" />

describe('Vital Signs Recording', () => {
  it('should display the vital signs page title', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.get('.page-header h1').should('contain', 'Vital Signs Recording');
  });

  it('should display vital signs content section', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.get('.content-section').should('exist');
    cy.get('.content-section').should('be.visible');
  });

  it('should navigate to vital signs from main medical records page', () => {
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'Vital Signs').click();
    cy.url().should('include', '/medical-records/vital-signs');
  });

  it('should highlight vital signs in navigation when active', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.contains('.sub-nav-link', 'Vital Signs').should('have.class', 'active');
  });

  it('should have proper page structure', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display Vital Signs card', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.contains('h3', 'Vital Signs').should('be.visible');
    cy.contains('Temperature').should('be.visible');
    cy.contains('Heart rate').should('be.visible');
    cy.contains('Respiratory rate').should('be.visible');
    cy.contains('Blood pressure').should('be.visible');
  });

  it('should display Tracking card', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.contains('h3', 'Tracking').should('be.visible');
    cy.contains('Trend charts').should('be.visible');
    cy.contains('Alert thresholds').should('be.visible');
    cy.contains('Historical data').should('be.visible');
    cy.contains('Comparisons').should('be.visible');
  });

  it('should display Monitoring card', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.contains('h3', 'Monitoring').should('be.visible');
    cy.contains('Real-time alerts').should('be.visible');
    cy.contains('Abnormal values').should('be.visible');
    cy.contains('Baseline comparisons').should('be.visible');
    cy.contains('Critical values').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should display comprehensive vital signs features', () => {
    cy.visitMedicalRecordsPage('vital-signs');

    const expectedFeatures = [
      'Temperature',
      'Heart rate',
      'Respiratory rate',
      'Blood pressure',
      'Trend charts',
      'Alert thresholds',
      'Historical data',
      'Comparisons',
      'Real-time alerts',
      'Abnormal values',
      'Baseline comparisons',
      'Critical values',
    ];

    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should allow navigation to other medical record sections', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.get('.sub-nav').should('exist');
    cy.contains('.sub-nav-link', 'Attachments').click();
    cy.url().should('include', '/medical-records/attachments');
  });

  it('should navigate back to all records from vital signs page', () => {
    cy.visitMedicalRecordsPage('vital-signs');
    cy.contains('.sub-nav-link', 'All Records').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/medical-records');
  });
});

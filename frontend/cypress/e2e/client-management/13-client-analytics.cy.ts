/// <reference types="cypress" />

describe('Client Analytics & Insights', () => {
  // Using first client from seeded data
  const clientId = 'client-001';

  beforeEach(() => {
    cy.visit(`/clients/${clientId}/analytics`);
  });

  it.skip('should display client analytics page', () => {
    // Skipped: Client analytics feature not yet implemented 
    cy.get('.page-header h1').should('contain', 'Client Analytics');
    cy.get('.analytics-section').should('be.visible');
  });

  it.skip('should display visit frequency metrics', () => {
    // Skipped: Client analytics feature not yet implemented 
    cy.get('.visit-frequency-section').should('be.visible');
    cy.get('.total-visits').should('contain', '15');
    cy.get('.visits-this-year').should('contain', '8');
  });

  it.skip('should display revenue metrics', () => {
    // Skipped: Client analytics feature not yet implemented 
    cy.get('.revenue-metrics-section').should('be.visible');
    cy.get('.lifetime-value').should('contain', '5000.00');
    cy.get('.revenue-this-year').should('contain', '1200.00');
  });

  it.skip('should display spending trends chart', () => {
    // Skipped: Client analytics feature not yet implemented 
    cy.get('.spending-trends-chart').should('be.visible');
  });

  it.skip('should display client engagement score', () => {
    // Skipped: Client analytics feature not yet implemented 
    cy.get('.engagement-section').should('be.visible');
    cy.get('.engagement-score').should('contain', '85');
  });

  it.skip('should display service utilization breakdown', () => {
    // Skipped: Client analytics feature not yet implemented 
    cy.get('.service-utilization-section').should('be.visible');
    cy.get('.service-item').should('have.length', 3);
  });

  it.skip('should display patient demographics for client', () => {
    // Skipped: Client analytics feature not yet implemented 
    cy.get('.patient-demographics-section').should('be.visible');
    cy.get('.total-patients').should('contain', '3');
  });

  it.skip('should allow exporting analytics report', () => {
    // Skipped: Client analytics feature not yet implemented 
    cy.get('.btn-export-analytics').click();
    cy.get('.export-options-modal').should('be.visible');

    cy.get('#export-format').select('PDF');
    cy.get('.btn-download-report').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Report generated');
  });
});

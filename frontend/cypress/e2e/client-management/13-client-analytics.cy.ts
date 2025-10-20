/// <reference types="cypress" />

describe('Client Analytics & Insights', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/analytics`);
    });
  });

  it('should display client analytics page', () => {
    cy.get('.page-header h1').should('contain', 'Client Analytics');
    cy.get('.analytics-section').should('be.visible');
  });

  it('should display visit frequency metrics', () => {

    cy.wait('@getVisitMetrics');
    cy.get('.visit-frequency-section').should('be.visible');
    cy.get('.total-visits').should('contain', '15');
    cy.get('.visits-this-year').should('contain', '8');
  });

  it('should display revenue metrics', () => {

    cy.wait('@getRevenueMetrics');
    cy.get('.revenue-metrics-section').should('be.visible');
    cy.get('.lifetime-value').should('contain', '5000.00');
    cy.get('.revenue-this-year').should('contain', '1200.00');
  });

  it('should display spending trends chart', () => {

    cy.wait('@getSpendingTrends');
    cy.get('.spending-trends-chart').should('be.visible');
  });

  it('should display client engagement score', () => {

    cy.wait('@getEngagement');
    cy.get('.engagement-section').should('be.visible');
    cy.get('.engagement-score').should('contain', '85');
  });

  it('should display service utilization breakdown', () => {

    cy.wait('@getServices');
    cy.get('.service-utilization-section').should('be.visible');
    cy.get('.service-item').should('have.length', 3);
  });

  it('should display patient demographics for client', () => {

    cy.wait('@getPatientDemographics');
    cy.get('.patient-demographics-section').should('be.visible');
    cy.get('.total-patients').should('contain', '3');
  });

  it('should allow exporting analytics report', () => {
    cy.get('.btn-export-analytics').click();
    cy.get('.export-options-modal').should('be.visible');
    

    cy.get('#export-format').select('PDF');
    cy.get('.btn-download-report').click();
    
    cy.wait('@exportReport');
    cy.get('.success-message').should('contain', 'Report generated');
  });
});

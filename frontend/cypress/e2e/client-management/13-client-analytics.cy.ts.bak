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
    cy.intercept('GET', '/api/clients/client-001/analytics/visits', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          totalVisits: 15,
          visitsThisYear: 8,
          averageVisitsPerYear: 6,
          lastVisitDate: '2024-01-15',
        },
      },
    }).as('getVisitMetrics');

    cy.wait('@getVisitMetrics');
    cy.get('.visit-frequency-section').should('be.visible');
    cy.get('.total-visits').should('contain', '15');
    cy.get('.visits-this-year').should('contain', '8');
  });

  it('should display revenue metrics', () => {
    cy.intercept('GET', '/api/clients/client-001/analytics/revenue', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          lifetimeValue: 5000.00,
          revenueThisYear: 1200.00,
          averageTransactionValue: 150.00,
        },
      },
    }).as('getRevenueMetrics');

    cy.wait('@getRevenueMetrics');
    cy.get('.revenue-metrics-section').should('be.visible');
    cy.get('.lifetime-value').should('contain', '5000.00');
    cy.get('.revenue-this-year').should('contain', '1200.00');
  });

  it('should display spending trends chart', () => {
    cy.intercept('GET', '/api/clients/client-001/analytics/spending-trends', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { month: '2024-01', amount: 200.00 },
          { month: '2024-02', amount: 300.00 },
          { month: '2024-03', amount: 250.00 },
        ],
      },
    }).as('getSpendingTrends');

    cy.wait('@getSpendingTrends');
    cy.get('.spending-trends-chart').should('be.visible');
  });

  it('should display client engagement score', () => {
    cy.intercept('GET', '/api/clients/client-001/analytics/engagement', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          engagementScore: 85,
          portalUsage: 'High',
          communicationResponseRate: 90,
        },
      },
    }).as('getEngagement');

    cy.wait('@getEngagement');
    cy.get('.engagement-section').should('be.visible');
    cy.get('.engagement-score').should('contain', '85');
  });

  it('should display service utilization breakdown', () => {
    cy.intercept('GET', '/api/clients/client-001/analytics/services', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { serviceName: 'Wellness Exams', count: 8, totalSpent: 800.00 },
          { serviceName: 'Vaccinations', count: 5, totalSpent: 250.00 },
          { serviceName: 'Dental Cleaning', count: 2, totalSpent: 400.00 },
        ],
      },
    }).as('getServices');

    cy.wait('@getServices');
    cy.get('.service-utilization-section').should('be.visible');
    cy.get('.service-item').should('have.length', 3);
  });

  it('should display patient demographics for client', () => {
    cy.intercept('GET', '/api/clients/client-001/analytics/patient-demographics', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          totalPatients: 3,
          speciesBreakdown: { Dog: 2, Cat: 1 },
          averageAge: 5.5,
        },
      },
    }).as('getPatientDemographics');

    cy.wait('@getPatientDemographics');
    cy.get('.patient-demographics-section').should('be.visible');
    cy.get('.total-patients').should('contain', '3');
  });

  it('should allow exporting analytics report', () => {
    cy.get('.btn-export-analytics').click();
    cy.get('.export-options-modal').should('be.visible');
    
    cy.intercept('POST', '/api/clients/client-001/analytics/export', {
      statusCode: 200,
      body: {
        status: 'success',
        url: 'https://example.com/analytics-report.pdf',
      },
    }).as('exportReport');

    cy.get('#export-format').select('PDF');
    cy.get('.btn-download-report').click();
    
    cy.wait('@exportReport');
    cy.get('.success-message').should('contain', 'Report generated');
  });
});

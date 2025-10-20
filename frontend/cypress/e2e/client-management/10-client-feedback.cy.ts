/// <reference types="cypress" />

describe('Client Feedback Management', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/feedback`);
    });
  });

  it('should display client feedback page', () => {
    cy.get('.page-header h1').should('contain', 'Client Feedback');
    cy.get('.feedback-section').should('be.visible');
  });

  it('should display feedback history', () => {
    cy.intercept('GET', '/api/clients/client-001/feedback', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 1, rating: 5, comment: 'Excellent service', date: '2024-01-15', type: 'review' },
          { id: 2, rating: 4, comment: 'Very good', date: '2024-01-10', type: 'survey' },
        ],
      },
    }).as('getFeedback');

    cy.wait('@getFeedback');
    cy.get('.feedback-item').should('have.length', 2);
  });

  it('should display average rating', () => {
    cy.intercept('GET', '/api/clients/client-001/feedback/summary', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { averageRating: 4.5, totalReviews: 10 },
      },
    }).as('getFeedbackSummary');

    cy.wait('@getFeedbackSummary');
    cy.get('.average-rating').should('be.visible');
    cy.get('.average-rating').should('contain', '4.5');
  });

  it('should allow sending feedback survey', () => {
    cy.get('.btn-send-survey').click();
    cy.get('.survey-modal').should('be.visible');
    
    cy.intercept('POST', '/api/clients/client-001/feedback/send-survey', {
      statusCode: 200,
      body: { status: 'success', message: 'Survey sent' },
    }).as('sendSurvey');

    cy.get('#survey-template').select('Visit Satisfaction');
    cy.get('.btn-send').click();
    
    cy.wait('@sendSurvey');
    cy.get('.success-message').should('contain', 'Survey sent');
  });

  it('should display feedback details', () => {
    cy.intercept('GET', '/api/clients/client-001/feedback', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 1, rating: 5, comment: 'Excellent service', date: '2024-01-15' },
        ],
      },
    });

    cy.visit(`/clients/client-001/feedback`);
    cy.get('.feedback-item').first().click();
    cy.get('.feedback-details-modal').should('be.visible');
    cy.get('.rating-display').should('contain', '5');
    cy.get('.comment-display').should('contain', 'Excellent service');
  });

  it('should allow responding to feedback', () => {
    cy.intercept('GET', '/api/clients/client-001/feedback', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 1, rating: 3, comment: 'Could be better', date: '2024-01-15' },
        ],
      },
    });

    cy.visit(`/clients/client-001/feedback`);
    cy.get('.btn-respond').first().click();
    cy.get('.response-modal').should('be.visible');
    
    cy.intercept('POST', '/api/feedback/1/respond', {
      statusCode: 200,
      body: { status: 'success' },
    }).as('respondToFeedback');

    cy.get('#response-text').type('Thank you for your feedback. We will improve.');
    cy.get('.btn-submit-response').click();
    
    cy.wait('@respondToFeedback');
    cy.get('.success-message').should('contain', 'Response sent');
  });

  it('should filter feedback by type', () => {
    cy.intercept('GET', '/api/clients/client-001/feedback*', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 1, rating: 5, type: 'review', date: '2024-01-15' },
        ],
      },
    }).as('filterFeedback');

    cy.get('#feedback-type-filter').select('review');
    cy.wait('@filterFeedback');
    
    cy.get('.feedback-item').each(($item) => {
      cy.wrap($item).find('.type-badge').should('contain', 'review');
    });
  });

  it('should display feedback trends and analytics', () => {
    cy.get('.btn-view-analytics').click();
    cy.get('.feedback-analytics-section').should('be.visible');
    cy.get('.rating-distribution-chart').should('be.visible');
    cy.get('.feedback-over-time-chart').should('be.visible');
  });
});

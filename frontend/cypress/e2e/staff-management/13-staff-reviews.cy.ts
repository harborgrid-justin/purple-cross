/// <reference types="cypress" />

describe('Staff Reviews and Evaluations', () => {
  beforeEach(() => {
    cy.visitStaff();
  });

  it('should display performance reviews section', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reviews-tab').click();
    cy.get('.reviews-section').should('be.visible');
  });

  it('should show past performance reviews', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reviews-tab').click();
    cy.get('.review-history').should('be.visible');
    cy.get('.review-item').should('have.length.at.least', 1);
  });

  it('should display review dates and ratings', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reviews-tab').click();
    cy.get('.review-item').first().within(() => {
      cy.get('.review-date').should('be.visible');
      cy.get('.overall-rating').should('be.visible');
    });
  });

  it('should allow creating new performance review', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reviews-tab').click();
    cy.get('.btn-create-review').click();
    cy.get('.review-form').should('be.visible');
    cy.get('#review-period').select('Q1 2024');
    cy.get('#overall-rating').select('Exceeds Expectations');
    cy.get('#comments').type('Excellent performance this quarter');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Review saved');
  });

  it('should show competency ratings', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reviews-tab').click();
    cy.get('.review-item').first().find('.btn-view-details').click();
    cy.get('.competency-ratings').should('be.visible');
    cy.get('.competency-item').should('have.length.at.least', 3);
  });

  it('should display goals and objectives', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.goals-tab').click();
    cy.get('.goals-list').should('be.visible');
    cy.get('.goal-item').should('have.length.at.least', 2);
  });

  it('should allow setting new goals', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.goals-tab').click();
    cy.get('.btn-add-goal').click();
    cy.get('#goal-title').type('Improve client communication');
    cy.get('#goal-description').type('Complete communication training course');
    cy.get('#target-date').type('2024-06-30');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Goal added');
  });

  it('should track goal progress', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.goals-tab').click();
    cy.get('.goal-item').first().within(() => {
      cy.get('.progress-bar').should('be.visible');
      cy.get('.progress-percentage').should('exist');
    });
  });

  it('should show development plans', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.development-tab').click();
    cy.get('.development-plan').should('be.visible');
  });

  it('should display 360-degree feedback', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reviews-tab').click();
    cy.get('.review-item').first().find('.btn-view-details').click();
    cy.get('.peer-feedback').should('be.visible');
  });
});

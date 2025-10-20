/// <reference types="cypress" />

describe('Staff Training and Compliance', () => {
  beforeEach(() => {
    cy.visitStaff();
  });

  it.skip('should display required training courses', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.required-training').should('be.visible');
    cy.get('.training-item').should('have.length.at.least', 3);
  });

  it.skip('should show training completion status', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item')
      .first()
      .within(() => {
        cy.get('.completion-status').should('exist');
        cy.get('.completion-badge').should('be.visible');
      });
  });

  it.skip('should display training due dates', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item')
      .first()
      .within(() => {
        cy.get('.due-date').should('be.visible');
      });
  });

  it.skip('should highlight overdue training', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item.overdue').should('have.class', 'alert-danger');
  });

  it.skip('should allow marking training as complete', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item.incomplete').first().find('.btn-complete').click();
    cy.get('#completion-date').type('2024-01-20');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Training marked complete');
  });

  it.skip('should show mandatory compliance training', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.compliance-training').should('be.visible');
    cy.get('.training-item.mandatory').should('have.length.at.least', 2);
  });

  it.skip('should display training certificates', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item.completed').first().find('.btn-view-certificate').should('be.visible');
  });

  it.skip('should track annual training hours', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.annual-training-hours').should('be.visible');
    cy.get('.total-hours').should('contain', 'hours');
  });

  it.skip('should show OSHA compliance status', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.compliance-tab').click();
    cy.get('.osha-compliance').should('be.visible');
  });

  it.skip('should display background check information', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.compliance-tab').click();
    cy.get('.background-check').should('be.visible');
    cy.get('.check-date').should('be.visible');
  });
});

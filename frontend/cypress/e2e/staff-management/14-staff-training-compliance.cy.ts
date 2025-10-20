/// <reference types="cypress" />

describe('Staff Training and Compliance', () => {
  beforeEach(() => {
    cy.visitStaff();
  });

  it('should display required training courses', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.required-training').should('be.visible');
    cy.get('.training-item').should('have.length.at.least', 3);
  });

  it('should show training completion status', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item').first().within(() => {
      cy.get('.completion-status').should('exist');
      cy.get('.completion-badge').should('be.visible');
    });
  });

  it('should display training due dates', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item').first().within(() => {
      cy.get('.due-date').should('be.visible');
    });
  });

  it('should highlight overdue training', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item.overdue').should('have.class', 'alert-danger');
  });

  it('should allow marking training as complete', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item.incomplete').first().find('.btn-complete').click();
    cy.get('#completion-date').type('2024-01-20');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Training marked complete');
  });

  it('should show mandatory compliance training', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.compliance-training').should('be.visible');
    cy.get('.training-item.mandatory').should('have.length.at.least', 2);
  });

  it('should display training certificates', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.training-item.completed').first().find('.btn-view-certificate').should('be.visible');
  });

  it('should track annual training hours', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.training-tab').click();
    cy.get('.annual-training-hours').should('be.visible');
    cy.get('.total-hours').should('contain', 'hours');
  });

  it('should show OSHA compliance status', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.compliance-tab').click();
    cy.get('.osha-compliance').should('be.visible');
  });

  it('should display background check information', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.compliance-tab').click();
    cy.get('.background-check').should('be.visible');
    cy.get('.check-date').should('be.visible');
  });
});

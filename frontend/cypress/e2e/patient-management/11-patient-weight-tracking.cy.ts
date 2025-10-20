/// <reference types="cypress" />

describe('Patient Weight Tracking', () => {
  beforeEach(() => {
    cy.visitPatients();
  });

  it('should display current weight for patient', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-display').should('be.visible');
    cy.get('.current-weight').should('contain', 'lbs');
  });

  it('should show weight history chart', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.weight-chart').should('be.visible');
  });

  it('should display weight measurements over time', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.weight-history-table').should('be.visible');
    cy.get('.weight-entry').should('have.length.at.least', 3);
  });

  it('should allow adding new weight measurement', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.btn-add-weight').click();
    cy.get('#weight-value').type('45.5');
    cy.get('#weight-unit').select('lbs');
    cy.get('#measurement-date').type('2024-01-20');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Weight recorded');
  });

  it('should highlight significant weight changes', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.weight-alert').should('be.visible');
    cy.get('.significant-change').should('have.class', 'alert-warning');
  });

  it('should calculate BMI or body condition score', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.body-condition-score').should('be.visible');
    cy.get('.bcs-value').should('match', /[1-9]/);
  });

  it('should show ideal weight range for breed', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.ideal-weight-range').should('be.visible');
    cy.get('.ideal-weight-range').should('contain', '-');
  });

  it('should allow toggling between weight units', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.unit-toggle').click();
    cy.get('.weight-entry').first().should('contain', 'kg');
  });

  it('should display weight trends (gaining/losing/stable)', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.weight-trend').should('be.visible');
    cy.get('.trend-indicator').should('exist');
  });

  it('should allow setting weight goals', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.weight-tracking-tab').click();
    cy.get('.btn-set-goal').click();
    cy.get('#target-weight').type('42');
    cy.get('#target-date').type('2024-06-01');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Goal set');
  });
});

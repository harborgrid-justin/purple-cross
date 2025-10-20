/// <reference types="cypress" />

describe('Staff Payroll Information', () => {
  beforeEach(() => {
    cy.visitStaff();
  });

  it.skip('should display payroll section for authorized users', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.payroll-section').should('be.visible');
  });

  it.skip('should show employment type', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.employment-type').should('be.visible');
  });

  it.skip('should display compensation information', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.compensation-info').should('be.visible');
  });

  it.skip('should show pay schedule', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.pay-schedule').should('contain', 'Bi-weekly');
  });

  it.skip('should display hours worked', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.hours-worked').should('be.visible');
    cy.get('.current-period-hours').should('contain', 'hours');
  });

  it.skip('should show overtime hours', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.overtime-hours').should('be.visible');
  });

  it.skip('should display direct deposit information', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.direct-deposit-info').should('be.visible');
  });

  it.skip('should allow updating tax withholding', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.btn-update-tax').click();
    cy.get('.tax-form').should('be.visible');
  });

  it.skip('should show year-to-date earnings', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.ytd-earnings').should('be.visible');
  });

  it.skip('should display benefits deductions', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.benefits-deductions').should('be.visible');
  });
});

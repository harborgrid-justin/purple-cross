/// <reference types="cypress" />

describe('Staff Payroll Information', () => {
  beforeEach(() => {
    cy.visitStaff();
  });

  it('should display payroll section for authorized users', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.payroll-section').should('be.visible');
  });

  it('should show employment type', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.employment-type').should('be.visible');
  });

  it('should display compensation information', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.compensation-info').should('be.visible');
  });

  it('should show pay schedule', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.pay-schedule').should('contain', 'Bi-weekly');
  });

  it('should display hours worked', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.hours-worked').should('be.visible');
    cy.get('.current-period-hours').should('contain', 'hours');
  });

  it('should show overtime hours', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.overtime-hours').should('be.visible');
  });

  it('should display direct deposit information', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.direct-deposit-info').should('be.visible');
  });

  it('should allow updating tax withholding', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.btn-update-tax').click();
    cy.get('.tax-form').should('be.visible');
  });

  it('should show year-to-date earnings', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.ytd-earnings').should('be.visible');
  });

  it('should display benefits deductions', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.payroll-tab').click();
    cy.get('.benefits-deductions').should('be.visible');
  });
});

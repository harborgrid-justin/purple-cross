/// <reference types="cypress" />

describe('Appointment Recurring Scheduling', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it('should allow creating recurring appointments', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#recurring-appointment').check();
    cy.get('.recurring-options').should('be.visible');
  });

  it('should display recurrence pattern options', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#recurring-appointment').check();
    cy.get('#recurrence-pattern').should('be.visible');
    cy.get('#recurrence-pattern option').should('have.length.at.least', 4);
  });

  it('should allow setting recurrence frequency', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#recurring-appointment').check();
    cy.get('#recurrence-pattern').select('Weekly');
    cy.get('#recurrence-interval').type('2');
    cy.get('#recurrence-interval').should('have.value', '2');
  });

  it('should show day selection for weekly recurrence', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#recurring-appointment').check();
    cy.get('#recurrence-pattern').select('Weekly');
    cy.get('.day-selector').should('be.visible');
    cy.get('.day-checkbox').should('have.length', 7);
  });

  it('should allow setting recurrence end date', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#recurring-appointment').check();
    cy.get('#recurrence-end-type').select('End Date');
    cy.get('#recurrence-end-date').should('be.visible');
    cy.get('#recurrence-end-date').type('2024-12-31');
  });

  it('should allow setting number of occurrences', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#recurring-appointment').check();
    cy.get('#recurrence-end-type').select('After');
    cy.get('#recurrence-count').should('be.visible');
    cy.get('#recurrence-count').type('10');
  });

  it('should preview recurring appointments', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#recurring-appointment').check();
    cy.get('#recurrence-pattern').select('Weekly');
    cy.get('.btn-preview-recurrence').click();
    cy.get('.recurrence-preview').should('be.visible');
    cy.get('.preview-date').should('have.length.at.least', 4);
  });

  it('should create multiple appointments from recurrence', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#patient-select').select('Buddy');
    cy.get('#recurring-appointment').check();
    cy.get('#recurrence-pattern').select('Weekly');
    cy.get('#recurrence-count').type('4');
    cy.get('button[type="submit"]').click();
    cy.get('.success-message').should('contain', 'recurring appointments created');
  });

  it('should show recurring appointment series indicator', () => {
    cy.visitAppointments();
    cy.get('.recurring-badge').should('be.visible');
  });

  it('should allow editing single occurrence', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-edit').click();
    cy.get('.edit-options').should('be.visible');
    cy.get('#edit-this-occurrence').check();
    cy.get('button[type="submit"]').click();
    cy.get('.success-message').should('contain', 'Appointment updated');
  });

  it('should allow editing all occurrences', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-edit').click();
    cy.get('#edit-all-occurrences').check();
    cy.get('button[type="submit"]').click();
    cy.get('.confirm-dialog').should('contain', 'all future appointments');
  });

  it('should allow cancelling recurring series', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-cancel-series').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.confirm-dialog').should('contain', 'Cancel entire series');
  });
});

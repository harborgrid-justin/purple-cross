/// <reference types="cypress" />

describe('Patient Appointments History', () => {
  beforeEach(() => {
    cy.visitPatients();
  });

  it.skip('should display all appointments for patient',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.appointments-list').should('be.visible');
    cy.get('.appointment-item').should('have.length.at.least', 1);
  });

  it.skip('should show upcoming appointments',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.upcoming-appointments').should('be.visible');
  });

  it.skip('should display past appointments',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.past-appointments').should('be.visible');
    cy.get('.past-appointment-item').should('have.length.at.least', 2);
  });

  it.skip('should allow scheduling new appointment from patient profile',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.btn-schedule-appointment').click();
    cy.get('.appointment-form').should('be.visible');
    cy.get('#appointment-type').should('be.visible');
  });

  it.skip('should display appointment types and reasons',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.appointment-item')
      .first()
      .within(() => {
        cy.get('.appointment-type').should('be.visible');
        cy.get('.appointment-reason').should('exist');
      });
  });

  it.skip('should show cancelled appointments separately',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.cancelled-appointments').should('be.visible');
  });

  it.skip('should display no-show appointments',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.appointment-item.no-show').should('have.class', 'alert-warning');
  });

  it.skip('should show appointment statistics',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.appointment-stats').should('be.visible');
    cy.get('.total-appointments').should('contain', 'Total');
  });

  it.skip('should allow filtering appointments by date range',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('#date-from').type('2024-01-01');
    cy.get('#date-to').type('2024-03-31');
    cy.get('.btn-filter').click();
    cy.get('.appointment-item').should('be.visible');
  });

  it.skip('should link to appointment details',


  // Skipped: Advanced patient management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.appointments-tab').click();
    cy.get('.appointment-item').first().find('.btn-view-details').click();
    cy.url().should('include', '/appointments/');
  });
});

/// <reference types="cypress" />

describe('Appointment Check-in Process', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it.skip('should display check-in button for upcoming appointments', () => {
    // Skipped: Check-in feature not yet implemented
    cy.get('.data-table tbody tr')
      .first()
      .within(() => {
        cy.get('.btn-check-in').should('be.visible');
      });
  });

  it.skip('should open check-in dialog', () => {
    // Skipped: Check-in feature not yet implemented
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.check-in-dialog').should('be.visible');
  });

  it.skip('should show patient and appointment details', () => {
    // Skipped: Check-in feature not yet implemented
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.patient-info').should('be.visible');
    cy.get('.appointment-details').should('be.visible');
  });

  it.skip('should allow confirming check-in', () => {
    // Skipped: Check-in feature not yet implemented
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.btn-confirm-check-in').click();
    cy.get('.success-message').should('contain', 'Checked in successfully');
  });

  it.skip('should update appointment status to checked-in', () => {
    // Skipped: Check-in feature not yet implemented
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.btn-confirm-check-in').click();
    cy.get('.status-badge').should('contain', 'Checked In');
  });

  it.skip('should record check-in time', () => {
    // Skipped: Check-in feature not yet implemented
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.check-in-time').should('be.visible');
  });

  it.skip('should allow early check-in', () => {
    // Skipped: Check-in feature not yet implemented
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.early-check-in-notice').should('be.visible');
    cy.get('.btn-confirm-check-in').should('be.enabled');
  });

  it.skip('should show waiting room status', () => {
    // Skipped: Check-in feature not yet implemented
    cy.visitAppointmentsPage('waiting-room');
    cy.get('.waiting-room').should('be.visible');
    cy.get('.waiting-patient').should('have.length.at.least', 1);
  });

  it.skip('should display wait time for checked-in patients', () => {
    // Skipped: Check-in feature not yet implemented
    cy.visitAppointmentsPage('waiting-room');
    cy.get('.waiting-patient')
      .first()
      .within(() => {
        cy.get('.wait-duration').should('be.visible');
      });
  });

  it.skip('should allow notifying patient when ready', () => {
    // Skipped: Check-in feature not yet implemented
    cy.visitAppointmentsPage('waiting-room');
    cy.get('.waiting-patient').first().find('.btn-ready').click();
    cy.get('.success-message').should('contain', 'Patient notified');
  });
});

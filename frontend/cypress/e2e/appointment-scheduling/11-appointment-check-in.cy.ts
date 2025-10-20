/// <reference types="cypress" />

describe('Appointment Check-in Process', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it('should display check-in button for upcoming appointments', () => {
    cy.get('.data-table tbody tr').first().within(() => {
      cy.get('.btn-check-in').should('be.visible');
    });
  });

  it('should open check-in dialog', () => {
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.check-in-dialog').should('be.visible');
  });

  it('should show patient and appointment details', () => {
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.patient-info').should('be.visible');
    cy.get('.appointment-details').should('be.visible');
  });

  it('should allow confirming check-in', () => {
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.btn-confirm-check-in').click();
    cy.get('.success-message').should('contain', 'Checked in successfully');
  });

  it('should update appointment status to checked-in', () => {
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.btn-confirm-check-in').click();
    cy.get('.status-badge').should('contain', 'Checked In');
  });

  it('should record check-in time', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.check-in-time').should('be.visible');
  });

  it('should allow early check-in', () => {
    cy.get('.data-table tbody tr').first().find('.btn-check-in').click();
    cy.get('.early-check-in-notice').should('be.visible');
    cy.get('.btn-confirm-check-in').should('be.enabled');
  });

  it('should show waiting room status', () => {
    cy.visitAppointmentsPage('waiting-room');
    cy.get('.waiting-room').should('be.visible');
    cy.get('.waiting-patient').should('have.length.at.least', 1);
  });

  it('should display wait time for checked-in patients', () => {
    cy.visitAppointmentsPage('waiting-room');
    cy.get('.waiting-patient').first().within(() => {
      cy.get('.wait-duration').should('be.visible');
    });
  });

  it('should allow notifying patient when ready', () => {
    cy.visitAppointmentsPage('waiting-room');
    cy.get('.waiting-patient').first().find('.btn-ready').click();
    cy.get('.success-message').should('contain', 'Patient notified');
  });
});

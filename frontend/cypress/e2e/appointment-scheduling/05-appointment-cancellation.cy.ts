/// <reference types="cypress" />

describe('Appointment Cancellation', () => {
  // Using first appointment from seeded data
  const appointmentId = 'appt-001';

  beforeEach(() => {});

  it('should display cancel button on appointment details page', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('button', 'Cancel Appointment').should('be.visible');
  });

  it('should display cancellation confirmation modal when cancel is clicked', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('button', 'Cancel Appointment').click();
    cy.get('.modal').should('be.visible');
    cy.get('.modal').should('contain', 'Cancel Appointment');
  });

  it('should display cancellation reason field in modal', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('button', 'Cancel Appointment').click();
    cy.get('.modal #cancellation-reason').should('be.visible');
  });

  it('should display confirm and dismiss buttons in modal', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('button', 'Cancel Appointment').click();
    cy.get('.modal button').contains('Confirm Cancellation').should('be.visible');
    cy.get('.modal button').contains('Keep Appointment').should('be.visible');
  });

  it('should close modal when dismiss button is clicked', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('button', 'Cancel Appointment').click();
    cy.get('.modal').should('be.visible');
    cy.get('.modal button').contains('Keep Appointment').click();
    cy.get('.modal').should('not.exist');
  });

  it.skip('should show cancelled appointments with appropriate styling', () => {
    // Skipped: Requires specific cancelled appointment in database
    cy.visitAppointments();
    cy.get('.data-table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.status-badge').should('contain', 'cancelled');
      });
  });

  it('should have accessible cancellation modal', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('button', 'Cancel Appointment').click();
    cy.get('.modal').should('have.attr', 'role', 'dialog');
    cy.get('.modal').should('have.attr', 'aria-labelledby');
  });
});

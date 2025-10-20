/// <reference types="cypress" />

describe('Appointment Cancellation', () => {
  beforeEach(() => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.intercept('GET', `/api/appointments/${appointment.id}`, {
        statusCode: 200,
        body: { status: 'success', data: appointment },
      });
    });
  });

  it('should display cancel button on appointment details page', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('button', 'Cancel Appointment').should('be.visible');
    });
  });

  it('should display cancellation confirmation modal when cancel is clicked', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('button', 'Cancel Appointment').click();
      cy.get('.modal').should('be.visible');
      cy.get('.modal').should('contain', 'Cancel Appointment');
    });
  });

  it('should display cancellation reason field in modal', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('button', 'Cancel Appointment').click();
      cy.get('.modal #cancellation-reason').should('be.visible');
    });
  });

  it('should display confirm and dismiss buttons in modal', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('button', 'Cancel Appointment').click();
      cy.get('.modal button').contains('Confirm Cancellation').should('be.visible');
      cy.get('.modal button').contains('Keep Appointment').should('be.visible');
    });
  });

  it('should close modal when dismiss button is clicked', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('button', 'Cancel Appointment').click();
      cy.get('.modal').should('be.visible');
      cy.get('.modal button').contains('Keep Appointment').click();
      cy.get('.modal').should('not.exist');
    });
  });

  it('should show cancelled appointments with appropriate styling', () => {
    cy.fixture('appointments').then((appointments) => {
      const cancelledAppts = appointments.filter(a => a.status === 'cancelled');
      cy.intercept('GET', '/api/appointments*', {
        statusCode: 200,
        body: { status: 'success', data: cancelledAppts },
      });
      cy.visitAppointments();
      
      cy.get('.data-table tbody tr', { timeout: 10000 }).first().within(() => {
        cy.get('.status-badge').should('contain', 'cancelled');
      });
    });
  });

  it('should have accessible cancellation modal', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('button', 'Cancel Appointment').click();
      cy.get('.modal').should('have.attr', 'role', 'dialog');
      cy.get('.modal').should('have.attr', 'aria-labelledby');
    });
  });
});

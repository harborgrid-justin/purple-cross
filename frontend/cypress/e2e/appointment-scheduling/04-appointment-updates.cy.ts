/// <reference types="cypress" />

describe('Appointment Updates', () => {
    cy.visitAppointments();

  beforeEach(() => {
  });

  it('should display the edit appointment page title', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('.page-header h1').should('contain', 'Edit Appointment');
    });
  });

  it('should pre-populate form fields with existing data', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('#appointment-type').should('have.value', appointment.appointmentType);
      cy.get('#reason').should('have.value', appointment.reason);
    });
  });

  it('should allow updating appointment type', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('#appointment-type').select('Surgery');
      cy.get('#appointment-type').should('have.value', 'Surgery');
    });
  });

  it('should allow updating appointment time', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('#start-time').should('exist');
      cy.get('#end-time').should('exist');
    });
  });

  it('should allow updating appointment status', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('#status').should('exist');
    });
  });

  it('should allow updating reason and notes', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('#reason').clear().type('Updated reason');
      cy.get('#reason').should('have.value', 'Updated reason');
      cy.get('#notes').should('exist');
    });
  });

  it('should display save button', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('button[type="submit"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Save Changes');
    });
  });

  it('should display cancel button', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('.btn-secondary').should('be.visible');
      cy.get('.btn-secondary').should('contain', 'Cancel');
    });
  });

  it('should validate required fields on update', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('#reason').clear();
      cy.get('button[type="submit"]').click();
      cy.get('#reason').should('have.attr', 'required');
    });
  });

  it('should have accessible form elements', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}/edit`);
      cy.get('#appointment-type').should('have.attr', 'aria-label');
      cy.get('button[type="submit"]').should('have.attr', 'aria-label');
    });
  });
});

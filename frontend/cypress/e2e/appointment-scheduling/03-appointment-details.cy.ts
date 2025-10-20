/// <reference types="cypress" />

describe('Appointment Details View', () => {
    cy.visitAppointments();

  beforeEach(() => {
  });

  it('should display the appointment details page title', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.get('.page-header h1').should('contain', 'Appointment Details');
    });
  });

  it('should display patient information', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('Patient').should('be.visible');
      cy.contains(appointment.patient.name).should('be.visible');
    });
  });

  it('should display owner information', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('Owner').should('be.visible');
      cy.contains(`${appointment.client.firstName} ${appointment.client.lastName}`).should('be.visible');
    });
  });

  it('should display veterinarian information', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('Veterinarian').should('be.visible');
      cy.contains(`Dr. ${appointment.veterinarian.lastName}`).should('be.visible');
    });
  });

  it('should display appointment type and status', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('Type').should('be.visible');
      cy.contains(appointment.appointmentType).should('be.visible');
      cy.get('.status-badge').should('be.visible');
    });
  });

  it('should display appointment date and time', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('Start Time').should('be.visible');
      cy.contains('End Time').should('be.visible');
    });
  });

  it('should display reason and notes', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.contains('Reason').should('be.visible');
      cy.contains(appointment.reason).should('be.visible');
    });
  });

  it('should display action buttons for editing and cancelling', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments[0];
      cy.visit(`/appointments/${appointment.id}`);
      cy.get('.btn-action').should('have.length.at.least', 1);
    });
  });
});

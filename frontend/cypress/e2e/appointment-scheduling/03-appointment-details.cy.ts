/// <reference types="cypress" />

describe('Appointment Details View', () => {
  // Using first appointment from seeded data
  const appointmentId = 'appt-001';

  beforeEach(() => {});

  it('should display the appointment details page title', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.get('.page-header h1').should('contain', 'Appointment Details');
  });

  it('should display patient information', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('Patient').should('be.visible');
    cy.get('.patient-info').should('be.visible');
  });

  it('should display owner information', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('Owner').should('be.visible');
    cy.get('.client-info').should('be.visible');
  });

  it('should display veterinarian information', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('Veterinarian').should('be.visible');
    cy.get('.staff-info').should('be.visible');
  });

  it('should display appointment type and status', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('Type').should('be.visible');
    cy.get('.status-badge').should('be.visible');
  });

  it('should display appointment date and time', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('Start Time').should('be.visible');
    cy.contains('End Time').should('be.visible');
  });

  it('should display reason and notes', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.contains('Reason').should('be.visible');
  });

  it('should display action buttons for editing and cancelling', () => {
    cy.visit(`/appointments/${appointmentId}`);
    cy.get('.btn-action').should('have.length.at.least', 1);
  });
});

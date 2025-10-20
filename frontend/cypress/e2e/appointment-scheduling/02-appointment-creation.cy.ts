/// <reference types="cypress" />

describe('Appointment Creation', () => {
  it('should display the create appointment page title', () => {
    cy.visitAppointmentsPage('create');
    cy.get('.page-header h1').should('contain', 'Schedule Appointment');
  });

  it('should display patient selection field', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#patient-select').should('be.visible');
    cy.get('label[for="patient-select"]').should('contain', 'Patient');
  });

  it('should display owner selection field', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#client-select').should('be.visible');
    cy.get('label[for="client-select"]').should('contain', 'Owner');
  });

  it('should display veterinarian selection field', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#veterinarian-select').should('be.visible');
    cy.get('label[for="veterinarian-select"]').should('contain', 'Veterinarian');
  });

  it('should display appointment type selection field', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#appointment-type').should('be.visible');
    cy.get('label[for="appointment-type"]').should('contain', 'Appointment Type');
  });

  it('should display date and time picker', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#start-time').should('be.visible');
    cy.get('label[for="start-time"]').should('contain', 'Start Time');
    cy.get('#end-time').should('be.visible');
    cy.get('label[for="end-time"]').should('contain', 'End Time');
  });

  it('should display reason field', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#reason').should('be.visible');
    cy.get('label[for="reason"]').should('contain', 'Reason');
  });

  it('should display notes field', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#notes').should('be.visible');
    cy.get('label[for="notes"]').should('contain', 'Notes');
  });

  it('should display submit button', () => {
    cy.visitAppointmentsPage('create');
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Schedule Appointment');
  });

  it('should display cancel button', () => {
    cy.visitAppointmentsPage('create');
    cy.get('.btn-secondary').should('be.visible');
    cy.get('.btn-secondary').should('contain', 'Cancel');
  });

  it('should have proper form validation for required fields', () => {
    cy.visitAppointmentsPage('create');
    cy.get('button[type="submit"]').click();

    cy.get('#patient-select').should('have.attr', 'required');
    cy.get('#client-select').should('have.attr', 'required');
    cy.get('#veterinarian-select').should('have.attr', 'required');
    cy.get('#appointment-type').should('have.attr', 'required');
  });

  it('should have accessible form labels and inputs', () => {
    cy.visitAppointmentsPage('create');

    cy.get('#patient-select').should('have.attr', 'aria-label');
    cy.get('#client-select').should('have.attr', 'aria-label');
    cy.get('#veterinarian-select').should('have.attr', 'aria-label');
    cy.get('button[type="submit"]').should('have.attr', 'aria-label');
  });
});

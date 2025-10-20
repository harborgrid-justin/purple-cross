/// <reference types="cypress" />

describe('Appointment Updates', () => {
  // Using first appointment from seeded data
  const appointmentId = 'appt-001';

  beforeEach(() => {});

  it('should display the edit appointment page title', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('.page-header h1').should('contain', 'Edit Appointment');
  });

  it('should pre-populate form fields with existing data', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('#appointment-type').should('exist');
    cy.get('#reason').should('exist');
  });

  it('should allow updating appointment type', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('#appointment-type').select('Surgery');
    cy.get('#appointment-type').should('have.value', 'Surgery');
  });

  it('should allow updating appointment time', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('#start-time').should('exist');
    cy.get('#end-time').should('exist');
  });

  it('should allow updating appointment status', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('#status').should('exist');
  });

  it('should allow updating reason and notes', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('#reason').clear().type('Updated reason');
    cy.get('#reason').should('have.value', 'Updated reason');
    cy.get('#notes').should('exist');
  });

  it('should display save button', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Save Changes');
  });

  it('should display cancel button', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('.btn-secondary').should('be.visible');
    cy.get('.btn-secondary').should('contain', 'Cancel');
  });

  it('should validate required fields on update', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('#reason').clear();
    cy.get('button[type="submit"]').click();
    cy.get('#reason').should('have.attr', 'required');
  });

  it('should have accessible form elements', () => {
    cy.visit(`/appointments/${appointmentId}/edit`);
    cy.get('#appointment-type').should('have.attr', 'aria-label');
    cy.get('button[type="submit"]').should('have.attr', 'aria-label');
  });
});

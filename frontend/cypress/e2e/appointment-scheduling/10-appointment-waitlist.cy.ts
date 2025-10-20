/// <reference types="cypress" />

describe('Appointment Waitlist Management', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it('should display waitlist section', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.waitlist-section').should('be.visible');
  });

  it('should show patients on waitlist', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.waitlist-table').should('be.visible');
    cy.get('.waitlist-item').should('have.length.at.least', 1);
  });

  it('should allow adding patient to waitlist', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.btn-add-to-waitlist').click();
    cy.get('#patient-select').select('Max');
    cy.get('#preferred-date').type('2024-02-15');
    cy.get('#appointment-type').select('Checkup');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Added to waitlist');
  });

  it('should display waitlist priority', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.waitlist-item')
      .first()
      .within(() => {
        cy.get('.priority-indicator').should('be.visible');
      });
  });

  it('should show time on waitlist', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.waitlist-item')
      .first()
      .within(() => {
        cy.get('.wait-time').should('be.visible');
      });
  });

  it('should allow removing from waitlist', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.waitlist-item').first().find('.btn-remove').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.btn-confirm-remove').click();
    cy.get('.success-message').should('contain', 'Removed from waitlist');
  });

  it('should allow converting waitlist to appointment', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.waitlist-item').first().find('.btn-schedule').click();
    cy.get('.appointment-form').should('be.visible');
    cy.get('#start-time').should('be.visible');
  });

  it('should notify when slot becomes available', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.notification-settings').should('be.visible');
  });

  it('should show waitlist statistics', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('.waitlist-stats').should('be.visible');
    cy.get('.total-waiting').should('contain', 'patients');
  });

  it('should allow filtering waitlist by appointment type', () => {
    cy.visitAppointmentsPage('waitlist');
    cy.get('#filter-type').select('Surgery');
    cy.get('.waitlist-item').should('be.visible');
  });
});

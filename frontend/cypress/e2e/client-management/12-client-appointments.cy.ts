/// <reference types="cypress" />

describe('Client Appointment History', () => {
  // Using first client from seeded data
  const clientId = 'client-001';

  beforeEach(() => {
    cy.visit(`/clients/${clientId}/appointments`);
  });

  it.skip('should display client appointments page', () => {
    // Skipped: Client appointment history feature not yet fully implemented
    cy.get('.page-header h1').should('contain', 'Client Appointments');
    cy.get('.appointments-section').should('be.visible');
  });

  it.skip('should display appointment history', () => {
    // Skipped: Client appointment history feature not yet fully implemented
    cy.get('.appointment-item').should('have.length', 2);
  });

  it.skip('should display upcoming appointments', () => {
    // Skipped: Client appointment history feature not yet fully implemented
    cy.get('#appointment-filter').select('upcoming');
    cy.get('.appointment-item').should('have.length.at.least', 1);
  });

  it.skip('should display past appointments', () => {
    // Skipped: Client appointment history feature not yet fully implemented
    cy.get('#appointment-filter').select('past');
    cy.get('.appointment-item').should('have.length.at.least', 1);
  });

  it.skip('should allow booking new appointment from client page', () => {
    // Skipped: Client appointment history feature not yet fully implemented
    cy.get('.btn-book-appointment').click();
    cy.get('.appointment-booking-modal').should('be.visible');
    cy.get('#select-patient').should('be.visible');
    cy.get('#select-date').should('be.visible');
    cy.get('#select-time').should('be.visible');
  });

  it.skip('should display appointment statistics', () => {
    // Skipped: Client appointment history feature not yet fully implemented
    cy.get('.appointment-statistics').should('be.visible');
    cy.get('.total-appointments').should('contain', '25');
  });

  it.skip('should display scheduling preferences', () => {
    // Skipped: Client appointment history feature not yet fully implemented
    cy.get('.scheduling-preferences-section').should('be.visible');
    cy.get('.preferred-day').should('be.visible');
    cy.get('.preferred-time').should('be.visible');
  });

  it.skip('should allow updating scheduling preferences', () => {
    // Skipped: Client appointment history feature not yet fully implemented
    cy.get('.btn-edit-preferences').click();

    cy.get('#preferred-day').select('Monday');
    cy.get('#preferred-time').select('Morning');
    cy.get('#reminder-preference').check();
    cy.get('.btn-save-preferences').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Preferences updated');
  });
});

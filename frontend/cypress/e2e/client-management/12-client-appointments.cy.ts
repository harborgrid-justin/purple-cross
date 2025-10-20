/// <reference types="cypress" />

describe('Client Appointment History', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/appointments`);
    });
  });

  it('should display client appointments page', () => {
    cy.get('.page-header h1').should('contain', 'Client Appointments');
    cy.get('.appointments-section').should('be.visible');
  });

  it('should display appointment history', () => {

    cy.wait('@getAppointments');
    cy.get('.appointment-item').should('have.length', 2);
  });

  it('should display upcoming appointments', () => {

    cy.get('#appointment-filter').select('upcoming');
    cy.wait('@getUpcoming');
    cy.get('.appointment-item').should('have.length.at.least', 1);
  });

  it('should display past appointments', () => {

    cy.get('#appointment-filter').select('past');
    cy.wait('@getPast');
    cy.get('.appointment-item').should('have.length.at.least', 1);
  });

  it('should allow booking new appointment from client page', () => {
    cy.get('.btn-book-appointment').click();
    cy.get('.appointment-booking-modal').should('be.visible');
    cy.get('#select-patient').should('be.visible');
    cy.get('#select-date').should('be.visible');
    cy.get('#select-time').should('be.visible');
  });

  it('should display appointment statistics', () => {

    cy.get('.appointment-statistics').should('be.visible');
    cy.wait('@getStatistics');
    cy.get('.total-appointments').should('contain', '25');
  });

  it('should display scheduling preferences', () => {
    cy.get('.scheduling-preferences-section').should('be.visible');
    cy.get('.preferred-day').should('be.visible');
    cy.get('.preferred-time').should('be.visible');
  });

  it('should allow updating scheduling preferences', () => {
    cy.get('.btn-edit-preferences').click();
    

    cy.get('#preferred-day').select('Monday');
    cy.get('#preferred-time').select('Morning');
    cy.get('#reminder-preference').check();
    cy.get('.btn-save-preferences').click();
    
    cy.wait('@updatePreferences');
    cy.get('.success-message').should('contain', 'Preferences updated');
  });
});

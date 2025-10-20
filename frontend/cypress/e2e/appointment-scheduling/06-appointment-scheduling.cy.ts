/// <reference types="cypress" />

describe('Appointment Scheduling Features', () => {
  it('should display the scheduling page title', () => {
    cy.visitAppointmentsPage('scheduling');
    cy.get('.page-header h1').should('contain', 'Appointment Scheduling');
  });

  it('should display calendar view', () => {
    cy.visitAppointmentsPage('scheduling');
    cy.get('.calendar-view').should('be.visible');
  });

  it('should display day, week, and month view options', () => {
    cy.visitAppointmentsPage('scheduling');
    cy.contains('button', 'Day').should('be.visible');
    cy.contains('button', 'Week').should('be.visible');
    cy.contains('button', 'Month').should('be.visible');
  });

  it('should display time slots in day view', () => {
    cy.visitAppointmentsPage('scheduling');
    cy.contains('button', 'Day').click();
    cy.get('.time-slot').should('have.length.at.least', 1);
  });

  it('should display veterinarian filter', () => {
    cy.visitAppointmentsPage('scheduling');
    cy.get('#veterinarian-filter').should('be.visible');
    cy.get('label[for="veterinarian-filter"]').should('contain', 'Filter by Veterinarian');
  });

  it('should display appointment type filter', () => {
    cy.visitAppointmentsPage('scheduling');
    cy.get('#type-filter').should('be.visible');
    cy.get('label[for="type-filter"]').should('contain', 'Filter by Type');
  });

  it('should display navigation controls for date selection', () => {
    cy.visitAppointmentsPage('scheduling');
    cy.get('.calendar-nav button').contains('Previous').should('be.visible');
    cy.get('.calendar-nav button').contains('Next').should('be.visible');
    cy.get('.calendar-nav button').contains('Today').should('be.visible');
  });

  it('should have accessible calendar controls', () => {
    cy.visitAppointmentsPage('scheduling');
    cy.get('.calendar-view').should('have.attr', 'role', 'region');
    cy.get('.calendar-view').should('have.attr', 'aria-label');
    cy.get('.calendar-nav').should('exist');
  });
});

/// <reference types="cypress" />

describe('Appointment Conflicts and Validation', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it('should detect double-booking conflicts', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#patient-select').select('Buddy');
    cy.get('#veterinarian-select').select('Dr. Emily Smith');
    cy.get('#start-time').type('2024-01-20T09:00');
    cy.get('#end-time').type('2024-01-20T09:30');
    cy.get('button[type="submit"]').click();
    cy.get('.conflict-warning').should('be.visible');
    cy.get('.conflict-warning').should('contain', 'already has an appointment');
  });

  it('should warn about overlapping appointments', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#veterinarian-select').select('Dr. Emily Smith');
    cy.get('#start-time').type('2024-01-20T09:15');
    cy.get('.overlap-warning').should('be.visible');
  });

  it('should validate appointment duration', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#start-time').type('2024-01-20T09:00');
    cy.get('#end-time').type('2024-01-20T08:45'); // End before start
    cy.get('button[type="submit"]').click();
    cy.get('.validation-error').should('contain', 'end time must be after start time');
  });

  it('should enforce minimum appointment duration', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#start-time').type('2024-01-20T09:00');
    cy.get('#end-time').type('2024-01-20T09:05'); // Only 5 minutes
    cy.get('.validation-warning').should('be.visible');
  });

  it('should validate business hours', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#start-time').type('2024-01-20T22:00'); // After hours
    cy.get('.validation-warning').should('contain', 'outside business hours');
  });

  it('should prevent scheduling on holidays', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#start-time').type('2024-12-25T09:00'); // Christmas
    cy.get('.validation-error').should('contain', 'holiday');
  });

  it('should check veterinarian availability', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#veterinarian-select').select('Dr. Emily Smith');
    cy.get('#start-time').type('2024-01-20T09:00');
    cy.get('.availability-indicator').should('exist');
  });

  it('should show available alternative time slots', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#start-time').type('2024-01-20T09:00');
    cy.get('.conflict-warning').should('be.visible');
    cy.get('.btn-show-alternatives').click();
    cy.get('.alternative-slots').should('be.visible');
    cy.get('.time-slot-option').should('have.length.at.least', 3);
  });

  it('should validate patient has no concurrent appointments', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#patient-select').select('Max');
    cy.get('#start-time').type('2024-01-20T10:00');
    cy.get('.patient-conflict-check').should('not.contain', 'already scheduled');
  });

  it('should allow overriding conflicts with confirmation', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#patient-select').select('Buddy');
    cy.get('#start-time').type('2024-01-20T09:00');
    cy.get('.conflict-warning').should('be.visible');
    cy.get('#override-conflict').check();
    cy.get('button[type="submit"]').click();
    cy.get('.confirm-dialog').should('contain', 'Are you sure');
  });
});

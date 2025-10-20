/// <reference types="cypress" />

describe('Appointment Resource Management', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it('should display room allocation for appointment', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.room-assignment').should('be.visible');
  });

  it('should allow assigning exam room', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-assign-room').click();
    cy.get('#room-select').should('be.visible');
    cy.get('#room-select').select('Exam Room 1');
    cy.get('.btn-save-room').click();
    cy.get('.success-message').should('contain', 'Room assigned');
  });

  it('should show equipment requirements', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.equipment-section').should('be.visible');
  });

  it('should allow adding equipment to appointment', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-add-equipment').click();
    cy.get('#equipment-select').select('X-Ray Machine');
    cy.get('.btn-save-equipment').click();
    cy.get('.success-message').should('be.visible');
  });

  it('should show staff assignments', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.staff-assignments').should('be.visible');
    cy.get('.assigned-veterinarian').should('be.visible');
  });

  it('should allow assigning additional staff', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-assign-staff').click();
    cy.get('#staff-select').select('Tech - Sarah Johnson');
    cy.get('.btn-save-staff').click();
    cy.get('.success-message').should('contain', 'Staff assigned');
  });

  it('should display resource conflicts', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#start-time').type('2024-01-20T09:00');
    cy.get('#room-select').select('Exam Room 1');
    cy.get('.conflict-warning').should('be.visible');
    cy.get('.conflict-warning').should('contain', 'already in use');
  });

  it('should show available rooms at selected time', () => {
    cy.visitAppointmentsPage('create');
    cy.get('#start-time').type('2024-01-20T14:00');
    cy.get('.available-rooms').should('be.visible');
    cy.get('.room-option.available').should('have.length.at.least', 1);
  });

  it('should display room occupancy calendar', () => {
    cy.visitAppointmentsPage('room-calendar');
    cy.get('.room-calendar').should('be.visible');
    cy.get('.room-row').should('have.length.at.least', 4);
  });

  it('should show equipment availability', () => {
    cy.visitAppointmentsPage('resources');
    cy.get('.equipment-availability').should('be.visible');
    cy.get('.equipment-item').should('have.length.at.least', 5);
  });
});

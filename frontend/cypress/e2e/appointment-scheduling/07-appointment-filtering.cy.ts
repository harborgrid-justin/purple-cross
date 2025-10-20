/// <reference types="cypress" />

describe('Appointment Filtering', () => {
  it('should filter appointments by status', () => {
      cy.visitAppointments();
      cy.get('#status-filter').should('be.visible');
      cy.get('#status-filter').select('scheduled');
      cy.get('#status-filter').should('have.value', 'scheduled');
  });

  it('should filter appointments by date range', () => {
    cy.visitAppointments();
    cy.get('#date-from').should('be.visible');
    cy.get('#date-to').should('be.visible');
    cy.get('label[for="date-from"]').should('contain', 'From');
    cy.get('label[for="date-to"]').should('contain', 'To');
  });

  it('should filter appointments by veterinarian', () => {
    cy.visitAppointments();
    cy.get('#veterinarian-filter').should('be.visible');
    cy.get('label[for="veterinarian-filter"]').should('contain', 'Veterinarian');
  });

  it('should filter appointments by patient', () => {
    cy.visitAppointments();
    cy.get('#patient-filter').should('be.visible');
    cy.get('label[for="patient-filter"]').should('contain', 'Patient');
  });

  it('should display clear filters button', () => {
    cy.visitAppointments();
    cy.contains('button', 'Clear Filters').should('be.visible');
  });
});

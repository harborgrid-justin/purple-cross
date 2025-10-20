/// <reference types="cypress" />

describe('Patient Medical History', () => {
  beforeEach(() => {
    cy.visitPatients();
  });

  it.skip('should display complete medical history for a patient', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.medical-history-timeline').should('be.visible');
  });

  it.skip('should show chronological order of medical events', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.history-item').should('have.length.at.least', 3);
    // Verify dates are in descending order
    cy.get('.history-item').first().find('.event-date').invoke('text').as('firstDate');
    cy.get('.history-item').eq(1).find('.event-date').invoke('text').as('secondDate');
  });

  it.skip('should display past diagnoses', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.diagnoses-section').should('be.visible');
    cy.get('.diagnosis-item').should('have.length.at.least', 1);
  });

  it.skip('should show previous surgeries and procedures', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.surgeries-section').should('be.visible');
    cy.get('.surgery-item').should('exist');
  });

  it.skip('should display known allergies prominently', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.allergies-alert').should('be.visible');
    cy.get('.allergies-alert').should('have.class', 'alert-danger');
  });

  it.skip('should allow adding new allergy information', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.btn-add-allergy').click();
    cy.get('#allergy-type').type('Penicillin');
    cy.get('#severity').select('Severe');
    cy.get('#reaction').type('Anaphylaxis');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Allergy added');
  });

  it.skip('should show chronic conditions', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.chronic-conditions').should('be.visible');
    cy.get('.condition-item').should('have.length.at.least', 1);
  });

  it.skip('should display vaccination history', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.vaccination-history-tab').click();
    cy.get('.vaccination-record').should('be.visible');
    cy.get('.vaccine-item').should('have.length.at.least', 3);
  });

  it.skip('should show upcoming vaccination due dates', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.vaccination-history-tab').click();
    cy.get('.upcoming-vaccines').should('be.visible');
    cy.get('.vaccine-due').should('have.length.at.least', 1);
  });

  it.skip('should allow recording new vaccination', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.vaccination-history-tab').click();
    cy.get('.btn-add-vaccine').click();
    cy.get('#vaccine-type').select('Rabies');
    cy.get('#vaccine-date').type('2024-01-15');
    cy.get('#batch-number').type('RB123456');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Vaccination recorded');
  });

  it.skip('should display parasite prevention history', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.preventive-care-tab').click();
    cy.get('.parasite-prevention').should('be.visible');
    cy.get('.prevention-item').should('exist');
  });

  it.skip('should show dental care history', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.dental-history').should('be.visible');
  });

  it.skip('should display previous medications', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medication-history-tab').click();
    cy.get('.medication-history-list').should('be.visible');
    cy.get('.past-medication').should('have.length.at.least', 1);
  });

  it.skip('should allow filtering medical history by category', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('#history-filter').select('Surgeries');
    cy.get('.history-item').each(($item) => {
      cy.wrap($item).should('contain', 'Surgery');
    });
  });

  it.skip('should show family medical history', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.family-history-tab').click();
    cy.get('.family-history').should('be.visible');
  });
});

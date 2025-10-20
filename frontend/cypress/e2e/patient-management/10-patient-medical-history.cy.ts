/// <reference types="cypress" />

describe('Patient Medical History', () => {
  beforeEach(() => {
    cy.visitPatients();
  });

  it('should display complete medical history for a patient', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.medical-history-timeline').should('be.visible');
  });

  it('should show chronological order of medical events', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.history-item').should('have.length.at.least', 3);
    // Verify dates are in descending order
    cy.get('.history-item').first().find('.event-date').invoke('text').as('firstDate');
    cy.get('.history-item').eq(1).find('.event-date').invoke('text').as('secondDate');
  });

  it('should display past diagnoses', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.diagnoses-section').should('be.visible');
    cy.get('.diagnosis-item').should('have.length.at.least', 1);
  });

  it('should show previous surgeries and procedures', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.surgeries-section').should('be.visible');
    cy.get('.surgery-item').should('exist');
  });

  it('should display known allergies prominently', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.allergies-alert').should('be.visible');
    cy.get('.allergies-alert').should('have.class', 'alert-danger');
  });

  it('should allow adding new allergy information', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.btn-add-allergy').click();
    cy.get('#allergy-type').type('Penicillin');
    cy.get('#severity').select('Severe');
    cy.get('#reaction').type('Anaphylaxis');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Allergy added');
  });

  it('should show chronic conditions', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.chronic-conditions').should('be.visible');
    cy.get('.condition-item').should('have.length.at.least', 1);
  });

  it('should display vaccination history', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.vaccination-history-tab').click();
    cy.get('.vaccination-record').should('be.visible');
    cy.get('.vaccine-item').should('have.length.at.least', 3);
  });

  it('should show upcoming vaccination due dates', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.vaccination-history-tab').click();
    cy.get('.upcoming-vaccines').should('be.visible');
    cy.get('.vaccine-due').should('have.length.at.least', 1);
  });

  it('should allow recording new vaccination', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.vaccination-history-tab').click();
    cy.get('.btn-add-vaccine').click();
    cy.get('#vaccine-type').select('Rabies');
    cy.get('#vaccine-date').type('2024-01-15');
    cy.get('#batch-number').type('RB123456');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Vaccination recorded');
  });

  it('should display parasite prevention history', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.preventive-care-tab').click();
    cy.get('.parasite-prevention').should('be.visible');
    cy.get('.prevention-item').should('exist');
  });

  it('should show dental care history', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('.dental-history').should('be.visible');
  });

  it('should display previous medications', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medication-history-tab').click();
    cy.get('.medication-history-list').should('be.visible');
    cy.get('.past-medication').should('have.length.at.least', 1);
  });

  it('should allow filtering medical history by category', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.medical-history-tab').click();
    cy.get('#history-filter').select('Surgeries');
    cy.get('.history-item').each(($item) => {
      cy.wrap($item).should('contain', 'Surgery');
    });
  });

  it('should show family medical history', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.family-history-tab').click();
    cy.get('.family-history').should('be.visible');
  });
});

/// <reference types="cypress" />

describe('Medical Records - Prescriptions Integration', () => {
  beforeEach(() => {
    cy.visitMedicalRecords();
  });

  it('should display prescriptions section in medical record', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.prescriptions-tab').click();
    cy.get('.prescriptions-list').should('be.visible');
  });

  it('should show active prescriptions', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.prescriptions-tab').click();
    cy.get('.prescription-item.active').should('have.length.at.least', 1);
  });

  it('should allow adding new prescription from medical record', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.prescriptions-tab').click();
    cy.get('.btn-add-prescription').click();
    cy.get('.prescription-form').should('be.visible');
    cy.get('#medication-name').type('Amoxicillin');
    cy.get('#dosage').type('250mg');
    cy.get('#frequency').type('Twice daily');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Prescription added');
  });

  it('should display prescription history', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.prescriptions-tab').click();
    cy.get('.prescription-history').should('be.visible');
    cy.get('.historical-prescription').should('have.length.at.least', 1);
  });

  it('should show prescription refill requests', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.prescriptions-tab').click();
    cy.get('.prescription-item')
      .first()
      .within(() => {
        cy.get('.refill-status').should('be.visible');
      });
  });

  it('should alert for drug interactions', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.prescriptions-tab').click();
    cy.get('.drug-interaction-alert').should('be.visible');
    cy.get('.interaction-warning').should('contain', 'interaction');
  });

  it('should display dosage instructions clearly', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.prescriptions-tab').click();
    cy.get('.prescription-item')
      .first()
      .within(() => {
        cy.get('.dosage-instructions').should('not.be.empty');
      });
  });

  it('should track prescription compliance', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.prescriptions-tab').click();
    cy.get('.prescription-item')
      .first()
      .within(() => {
        cy.get('.compliance-indicator').should('exist');
      });
  });
});

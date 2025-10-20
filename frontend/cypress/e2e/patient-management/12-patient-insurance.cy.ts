/// <reference types="cypress" />

describe('Patient Insurance Management', () => {
  beforeEach(() => {
    cy.visitPatients();
  });

  it('should display insurance information for patient', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.insurance-info').should('be.visible');
  });

  it('should show active insurance policies', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.active-policies').should('be.visible');
    cy.get('.policy-item').should('have.length.at.least', 1);
  });

  it('should display insurance provider details', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.policy-item').first().within(() => {
      cy.get('.provider-name').should('not.be.empty');
      cy.get('.policy-number').should('be.visible');
      cy.get('.coverage-level').should('be.visible');
    });
  });

  it('should allow adding new insurance policy', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.btn-add-policy').click();
    cy.get('#provider-name').type('PetInsure');
    cy.get('#policy-number').type('PI123456789');
    cy.get('#coverage-type').select('Comprehensive');
    cy.get('#effective-date').type('2024-01-01');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Insurance policy added');
  });

  it('should show coverage limits and deductibles', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.policy-item').first().within(() => {
      cy.get('.coverage-limit').should('be.visible');
      cy.get('.deductible-amount').should('be.visible');
    });
  });

  it('should display coverage verification status', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.verification-status').should('be.visible');
    cy.get('.verified-badge, .pending-badge').should('exist');
  });

  it('should allow verifying insurance coverage', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.policy-item').first().find('.btn-verify').click();
    cy.get('.verification-form').should('be.visible');
    cy.get('.btn-submit-verification').click();
    cy.get('.success-message').should('contain', 'Verification requested');
  });

  it('should show insurance claim history', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.claims-history-tab').click();
    cy.get('.claims-list').should('be.visible');
  });

  it('should display policy expiration warnings', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.policy-expiring-soon').should('exist');
    cy.get('.expiration-alert').should('have.class', 'alert-warning');
  });

  it('should allow uploading insurance documents', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.insurance-tab').click();
    cy.get('.policy-item').first().find('.btn-upload-docs').click();
    cy.get('.document-upload-form').should('be.visible');
  });
});

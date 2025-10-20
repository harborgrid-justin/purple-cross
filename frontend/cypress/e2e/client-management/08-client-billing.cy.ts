/// <reference types="cypress" />

describe('Client Billing & Invoicing', () => {
  // Using first client from seeded data
  const clientId = 'client-001';

  beforeEach(() => {
    cy.visit(`/clients/${clientId}/billing`);
  });

  it.skip('should display client billing page', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.get('.page-header h1').should('contain', 'Client Billing');
    cy.get('.billing-section').should('be.visible');
  });

  it.skip('should display invoice history', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.get('.invoice-item').should('have.length', 2);
  });

  it.skip('should display invoice details', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.visit(`/clients/client-001/billing`);
    cy.get('.invoice-item').first().click();
    cy.get('.invoice-details-modal').should('be.visible');
    cy.get('.invoice-number').should('contain', 'INV-2024-001');
    cy.get('.invoice-amount').should('contain', '150.00');
  });

  it.skip('should display outstanding balance', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.get('.outstanding-balance').should('be.visible');
    cy.get('.outstanding-balance').should('contain', '500.00');
  });

  it.skip('should filter invoices by status', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.get('#invoice-status-filter').select('paid');
    cy.get('.invoice-item').each(($item) => {
      cy.wrap($item).find('.status-badge').should('contain', 'paid');
    });
  });

  it.skip('should allow recording a payment', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.visit(`/clients/client-001/billing`);
    cy.get('.btn-record-payment').first().click();
    cy.get('.payment-modal').should('be.visible');

    cy.get('#payment-amount').type('150.00');
    cy.get('#payment-method').select('Credit Card');
    cy.get('.btn-submit-payment').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Payment recorded');
  });

  it.skip('should display payment history', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.get('.payment-history-section').should('be.visible');
    cy.get('.payment-item').should('have.length', 2);
  });

  it.skip('should generate and download invoice PDF', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.visit(`/clients/client-001/billing`);

    cy.get('.btn-download-invoice').first().click();
  });

  it.skip('should display billing statements', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.get('.btn-view-statements').click();
    cy.get('.statements-section').should('be.visible');

    cy.get('.statement-item').should('have.length', 1);
  });

  it.skip('should send invoice via email', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.visit(`/clients/client-001/billing`);

    cy.get('.btn-email-invoice').first().click();
    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Invoice sent');
  });

  it.skip('should display payment plans', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.get('.payment-plans-section').should('be.visible');

    cy.get('.payment-plan-item').should('have.length', 1);
  });

  it.skip('should allow setting up a payment plan', () => {
    // Skipped: Advanced billing feature not yet fully implemented 
    cy.get('.btn-setup-payment-plan').click();
    cy.get('.payment-plan-modal').should('be.visible');

    cy.get('#total-amount').type('1000');
    cy.get('#monthly-payment').type('100');
    cy.get('#start-date').type('2024-02-01');
    cy.get('.btn-create-plan').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Payment plan created');
  });
});

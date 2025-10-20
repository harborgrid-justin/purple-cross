/// <reference types="cypress" />

describe('Client Billing & Invoicing', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/billing`);
    });
  });

  it('should display client billing page', () => {
    cy.get('.page-header h1').should('contain', 'Client Billing');
    cy.get('.billing-section').should('be.visible');
  });

  it('should display invoice history', () => {

    cy.wait('@getInvoices');
    cy.get('.invoice-item').should('have.length', 2);
  });

  it('should display invoice details', () => {

    cy.visit(`/clients/client-001/billing`);
    cy.get('.invoice-item').first().click();
    cy.get('.invoice-details-modal').should('be.visible');
    cy.get('.invoice-number').should('contain', 'INV-2024-001');
    cy.get('.invoice-amount').should('contain', '150.00');
  });

  it('should display outstanding balance', () => {

    cy.wait('@getBalance');
    cy.get('.outstanding-balance').should('be.visible');
    cy.get('.outstanding-balance').should('contain', '500.00');
  });

  it('should filter invoices by status', () => {

    cy.get('#invoice-status-filter').select('paid');
    cy.wait('@filterInvoices');
    
    cy.get('.invoice-item').each(($item) => {
      cy.wrap($item).find('.status-badge').should('contain', 'paid');
    });
  });

  it('should allow recording a payment', () => {

    cy.visit(`/clients/client-001/billing`);
    cy.get('.btn-record-payment').first().click();
    cy.get('.payment-modal').should('be.visible');
    

    cy.get('#payment-amount').type('150.00');
    cy.get('#payment-method').select('Credit Card');
    cy.get('.btn-submit-payment').click();
    
    cy.wait('@recordPayment');
    cy.get('.success-message').should('contain', 'Payment recorded');
  });

  it('should display payment history', () => {

    cy.get('.payment-history-section').should('be.visible');
    cy.wait('@getPayments');
    cy.get('.payment-item').should('have.length', 2);
  });

  it('should generate and download invoice PDF', () => {

    cy.visit(`/clients/client-001/billing`);
    

    cy.get('.btn-download-invoice').first().click();
    cy.wait('@downloadInvoice');
  });

  it('should display billing statements', () => {
    cy.get('.btn-view-statements').click();
    cy.get('.statements-section').should('be.visible');
    

    cy.wait('@getStatements');
    cy.get('.statement-item').should('have.length', 1);
  });

  it('should send invoice via email', () => {

    cy.visit(`/clients/client-001/billing`);
    

    cy.get('.btn-email-invoice').first().click();
    cy.wait('@sendInvoice');
    cy.get('.success-message').should('contain', 'Invoice sent');
  });

  it('should display payment plans', () => {
    cy.get('.payment-plans-section').should('be.visible');
    

    cy.wait('@getPaymentPlans');
    cy.get('.payment-plan-item').should('have.length', 1);
  });

  it('should allow setting up a payment plan', () => {
    cy.get('.btn-setup-payment-plan').click();
    cy.get('.payment-plan-modal').should('be.visible');
    

    cy.get('#total-amount').type('1000');
    cy.get('#monthly-payment').type('100');
    cy.get('#start-date').type('2024-02-01');
    cy.get('.btn-create-plan').click();
    
    cy.wait('@createPaymentPlan');
    cy.get('.success-message').should('contain', 'Payment plan created');
  });
});

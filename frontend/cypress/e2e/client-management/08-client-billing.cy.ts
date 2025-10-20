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
    cy.intercept('GET', '/api/clients/client-001/invoices', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'inv-001', invoiceNumber: 'INV-2024-001', amount: 150.00, status: 'paid', date: '2024-01-15' },
          { id: 'inv-002', invoiceNumber: 'INV-2024-002', amount: 200.00, status: 'pending', date: '2024-01-20' },
        ],
      },
    }).as('getInvoices');

    cy.wait('@getInvoices');
    cy.get('.invoice-item').should('have.length', 2);
  });

  it('should display invoice details', () => {
    cy.intercept('GET', '/api/clients/client-001/invoices', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'inv-001', invoiceNumber: 'INV-2024-001', amount: 150.00, status: 'paid' },
        ],
      },
    });

    cy.visit(`/clients/client-001/billing`);
    cy.get('.invoice-item').first().click();
    cy.get('.invoice-details-modal').should('be.visible');
    cy.get('.invoice-number').should('contain', 'INV-2024-001');
    cy.get('.invoice-amount').should('contain', '150.00');
  });

  it('should display outstanding balance', () => {
    cy.intercept('GET', '/api/clients/client-001/balance', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { outstandingBalance: 500.00 },
      },
    }).as('getBalance');

    cy.wait('@getBalance');
    cy.get('.outstanding-balance').should('be.visible');
    cy.get('.outstanding-balance').should('contain', '500.00');
  });

  it('should filter invoices by status', () => {
    cy.intercept('GET', '/api/clients/client-001/invoices*', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'inv-001', status: 'paid', amount: 150.00 },
        ],
      },
    }).as('filterInvoices');

    cy.get('#invoice-status-filter').select('paid');
    cy.wait('@filterInvoices');
    
    cy.get('.invoice-item').each(($item) => {
      cy.wrap($item).find('.status-badge').should('contain', 'paid');
    });
  });

  it('should allow recording a payment', () => {
    cy.intercept('GET', '/api/clients/client-001/invoices', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'inv-001', invoiceNumber: 'INV-2024-001', amount: 150.00, status: 'pending' },
        ],
      },
    });

    cy.visit(`/clients/client-001/billing`);
    cy.get('.btn-record-payment').first().click();
    cy.get('.payment-modal').should('be.visible');
    
    cy.intercept('POST', '/api/invoices/inv-001/payments', {
      statusCode: 201,
      body: { status: 'success', data: { paymentId: 'pay-001' } },
    }).as('recordPayment');

    cy.get('#payment-amount').type('150.00');
    cy.get('#payment-method').select('Credit Card');
    cy.get('.btn-submit-payment').click();
    
    cy.wait('@recordPayment');
    cy.get('.success-message').should('contain', 'Payment recorded');
  });

  it('should display payment history', () => {
    cy.intercept('GET', '/api/clients/client-001/payments', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'pay-001', amount: 150.00, method: 'Credit Card', date: '2024-01-15' },
          { id: 'pay-002', amount: 200.00, method: 'Cash', date: '2024-01-20' },
        ],
      },
    }).as('getPayments');

    cy.get('.payment-history-section').should('be.visible');
    cy.wait('@getPayments');
    cy.get('.payment-item').should('have.length', 2);
  });

  it('should generate and download invoice PDF', () => {
    cy.intercept('GET', '/api/clients/client-001/invoices', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'inv-001', invoiceNumber: 'INV-2024-001', amount: 150.00 },
        ],
      },
    });

    cy.visit(`/clients/client-001/billing`);
    
    cy.intercept('GET', '/api/invoices/inv-001/pdf', {
      statusCode: 200,
      body: { status: 'success', url: 'https://example.com/invoice.pdf' },
    }).as('downloadInvoice');

    cy.get('.btn-download-invoice').first().click();
    cy.wait('@downloadInvoice');
  });

  it('should display billing statements', () => {
    cy.get('.btn-view-statements').click();
    cy.get('.statements-section').should('be.visible');
    
    cy.intercept('GET', '/api/clients/client-001/statements', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'stmt-001', period: '2024-01', totalBilled: 500.00, totalPaid: 350.00 },
        ],
      },
    }).as('getStatements');

    cy.wait('@getStatements');
    cy.get('.statement-item').should('have.length', 1);
  });

  it('should send invoice via email', () => {
    cy.intercept('GET', '/api/clients/client-001/invoices', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'inv-001', invoiceNumber: 'INV-2024-001', amount: 150.00 },
        ],
      },
    });

    cy.visit(`/clients/client-001/billing`);
    
    cy.intercept('POST', '/api/invoices/inv-001/send-email', {
      statusCode: 200,
      body: { status: 'success', message: 'Invoice sent' },
    }).as('sendInvoice');

    cy.get('.btn-email-invoice').first().click();
    cy.wait('@sendInvoice');
    cy.get('.success-message').should('contain', 'Invoice sent');
  });

  it('should display payment plans', () => {
    cy.get('.payment-plans-section').should('be.visible');
    
    cy.intercept('GET', '/api/clients/client-001/payment-plans', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'plan-001', totalAmount: 1000.00, monthlyPayment: 100.00, remainingBalance: 600.00 },
        ],
      },
    }).as('getPaymentPlans');

    cy.wait('@getPaymentPlans');
    cy.get('.payment-plan-item').should('have.length', 1);
  });

  it('should allow setting up a payment plan', () => {
    cy.get('.btn-setup-payment-plan').click();
    cy.get('.payment-plan-modal').should('be.visible');
    
    cy.intercept('POST', '/api/clients/client-001/payment-plans', {
      statusCode: 201,
      body: { status: 'success', data: { planId: 'plan-002' } },
    }).as('createPaymentPlan');

    cy.get('#total-amount').type('1000');
    cy.get('#monthly-payment').type('100');
    cy.get('#start-date').type('2024-02-01');
    cy.get('.btn-create-plan').click();
    
    cy.wait('@createPaymentPlan');
    cy.get('.success-message').should('contain', 'Payment plan created');
  });
});

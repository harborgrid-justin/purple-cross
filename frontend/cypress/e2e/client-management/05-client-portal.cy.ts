/// <reference types="cypress" />

describe('Client Portal Management', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/portal`);
    });
  });

  it('should display client portal page', () => {
    cy.get('.page-header h1').should('contain', 'Client Portal');
    cy.get('.portal-section').should('be.visible');
  });

  it('should show portal access status', () => {
    cy.get('.portal-status').should('be.visible');
    cy.get('.portal-status').should('contain', 'Portal Access');
  });

  it('should allow enabling portal access', () => {
    cy.intercept('POST', '/api/clients/client-001/portal/enable', {
      statusCode: 200,
      body: { status: 'success', data: { portalEnabled: true } },
    }).as('enablePortal');

    cy.get('.btn-enable-portal').click();
    cy.wait('@enablePortal');
    cy.get('.success-message').should('contain', 'Portal access enabled');
  });

  it('should allow disabling portal access', () => {
    cy.intercept('POST', '/api/clients/client-001/portal/disable', {
      statusCode: 200,
      body: { status: 'success', data: { portalEnabled: false } },
    }).as('disablePortal');

    cy.get('.btn-disable-portal').click();
    cy.get('.confirm-modal').should('be.visible');
    cy.get('.btn-confirm').click();
    
    cy.wait('@disablePortal');
    cy.get('.success-message').should('contain', 'Portal access disabled');
  });

  it('should send portal invitation email', () => {
    cy.intercept('POST', '/api/clients/client-001/portal/send-invitation', {
      statusCode: 200,
      body: { status: 'success', message: 'Invitation sent' },
    }).as('sendInvitation');

    cy.get('.btn-send-invitation').click();
    cy.wait('@sendInvitation');
    cy.get('.success-message').should('contain', 'Invitation sent');
  });

  it('should display portal login credentials section', () => {
    cy.get('.portal-credentials').should('be.visible');
    cy.get('.portal-credentials').should('contain', 'Login Credentials');
  });

  it('should allow resetting portal password', () => {
    cy.intercept('POST', '/api/clients/client-001/portal/reset-password', {
      statusCode: 200,
      body: { status: 'success', message: 'Password reset email sent' },
    }).as('resetPassword');

    cy.get('.btn-reset-password').click();
    cy.get('.confirm-modal').should('be.visible');
    cy.get('.btn-confirm').click();
    
    cy.wait('@resetPassword');
    cy.get('.success-message').should('contain', 'Password reset email sent');
  });
});

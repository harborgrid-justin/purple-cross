/// <reference types="cypress" />

describe('Client Portal Management', () => {
  // Using first client from seeded data
  const clientId = 'client-001';

  beforeEach(() => {
    cy.visit(`/clients/${clientId}/portal`);
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
    cy.get('.btn-enable-portal').click();
    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Portal access enabled');
  });

  it('should allow disabling portal access', () => {
    cy.get('.btn-disable-portal').click();
    cy.get('.confirm-modal').should('be.visible');
    cy.get('.btn-confirm').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Portal access disabled');
  });

  it('should send portal invitation email', () => {
    cy.get('.btn-send-invitation').click();
    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Invitation sent');
  });

  it('should display portal login credentials section', () => {
    cy.get('.portal-credentials').should('be.visible');
    cy.get('.portal-credentials').should('contain', 'Login Credentials');
  });

  it('should allow resetting portal password', () => {
    cy.get('.btn-reset-password').click();
    cy.get('.confirm-modal').should('be.visible');
    cy.get('.btn-confirm').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Password reset email sent');
  });
});

/// <reference types="cypress" />

describe('Client Loyalty Programs', () => {
  // Using first client from seeded data
  const clientId = 'client-001';

  beforeEach(() => {
    cy.visit(`/clients/${clientId}/loyalty`);
  });

  it.skip('should display client loyalty page', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.page-header h1').should('contain', 'Loyalty Program');
    cy.get('.loyalty-section').should('be.visible');
  });

  it.skip('should display loyalty points balance', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.points-balance').should('be.visible');
    cy.get('.points-balance').should('contain', '250');
  });

  it.skip('should display loyalty tier information', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.tier-badge').should('be.visible');
    cy.get('.tier-badge').should('contain', 'Silver');
  });

  it.skip('should display points earning history', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.points-history-item').should('have.length', 2);
  });

  it.skip('should display available rewards', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.rewards-section').should('be.visible');
    cy.get('.reward-item').should('have.length', 2);
  });

  it.skip('should allow redeeming rewards', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.visit(`/clients/client-001/loyalty`);

    cy.get('.btn-redeem-reward').first().click();
    cy.get('.confirm-modal').should('be.visible');
    cy.get('.btn-confirm').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Reward redeemed');
  });

  it.skip('should display tier progression', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.tier-progress').should('be.visible');
    cy.get('.points-to-next-tier').should('contain', '250');
  });

  it.skip('should display loyalty tier benefits', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.tier-benefits-section').should('be.visible');
    cy.get('.benefit-item').should('have.length.at.least', 1);
  });

  it.skip('should allow manually adding points', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.btn-add-points').click();
    cy.get('.add-points-modal').should('be.visible');

    cy.get('#points-amount').type('100');
    cy.get('#points-reason').type('Special promotion');
    cy.get('.btn-submit').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Points added');
  });

  it.skip('should display redeemed rewards history', () => {
    // Skipped: Loyalty program feature not yet implemented
    cy.get('.redeemed-rewards-section').should('be.visible');
    cy.get('.redeemed-reward-item').should('have.length', 1);
  });
});

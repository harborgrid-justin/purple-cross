/// <reference types="cypress" />

describe('Client Loyalty Programs', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/loyalty`);
    });
  });

  it('should display client loyalty page', () => {
    cy.get('.page-header h1').should('contain', 'Loyalty Program');
    cy.get('.loyalty-section').should('be.visible');
  });

  it('should display loyalty points balance', () => {

    cy.wait('@getLoyalty');
    cy.get('.points-balance').should('be.visible');
    cy.get('.points-balance').should('contain', '250');
  });

  it('should display loyalty tier information', () => {

    cy.wait('@getLoyalty');
    cy.get('.tier-badge').should('be.visible');
    cy.get('.tier-badge').should('contain', 'Silver');
  });

  it('should display points earning history', () => {

    cy.wait('@getHistory');
    cy.get('.points-history-item').should('have.length', 2);
  });

  it('should display available rewards', () => {

    cy.get('.rewards-section').should('be.visible');
    cy.wait('@getRewards');
    cy.get('.reward-item').should('have.length', 2);
  });

  it('should allow redeeming rewards', () => {


    cy.visit(`/clients/client-001/loyalty`);
    

    cy.get('.btn-redeem-reward').first().click();
    cy.get('.confirm-modal').should('be.visible');
    cy.get('.btn-confirm').click();
    
    cy.wait('@redeemReward');
    cy.get('.success-message').should('contain', 'Reward redeemed');
  });

  it('should display tier progression', () => {

    cy.wait('@getLoyalty');
    cy.get('.tier-progress').should('be.visible');
    cy.get('.points-to-next-tier').should('contain', '250');
  });

  it('should display loyalty tier benefits', () => {
    cy.get('.tier-benefits-section').should('be.visible');
    cy.get('.benefit-item').should('have.length.at.least', 1);
  });

  it('should allow manually adding points', () => {
    cy.get('.btn-add-points').click();
    cy.get('.add-points-modal').should('be.visible');
    

    cy.get('#points-amount').type('100');
    cy.get('#points-reason').type('Special promotion');
    cy.get('.btn-submit').click();
    
    cy.wait('@addPoints');
    cy.get('.success-message').should('contain', 'Points added');
  });

  it('should display redeemed rewards history', () => {

    cy.get('.redeemed-rewards-section').should('be.visible');
    cy.wait('@getRedeemedRewards');
    cy.get('.redeemed-reward-item').should('have.length', 1);
  });
});

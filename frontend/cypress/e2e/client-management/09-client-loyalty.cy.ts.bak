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
    cy.intercept('GET', '/api/clients/client-001/loyalty', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { points: 250, tier: 'Silver', nextTierPoints: 500 },
      },
    }).as('getLoyalty');

    cy.wait('@getLoyalty');
    cy.get('.points-balance').should('be.visible');
    cy.get('.points-balance').should('contain', '250');
  });

  it('should display loyalty tier information', () => {
    cy.intercept('GET', '/api/clients/client-001/loyalty', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { points: 250, tier: 'Silver', nextTierPoints: 500 },
      },
    }).as('getLoyalty');

    cy.wait('@getLoyalty');
    cy.get('.tier-badge').should('be.visible');
    cy.get('.tier-badge').should('contain', 'Silver');
  });

  it('should display points earning history', () => {
    cy.intercept('GET', '/api/clients/client-001/loyalty/history', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 1, points: 50, reason: 'Visit completed', date: '2024-01-15' },
          { id: 2, points: 100, reason: 'Referral bonus', date: '2024-01-10' },
        ],
      },
    }).as('getHistory');

    cy.wait('@getHistory');
    cy.get('.points-history-item').should('have.length', 2);
  });

  it('should display available rewards', () => {
    cy.intercept('GET', '/api/loyalty/rewards', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'reward-001', name: '10% Discount', pointsCost: 100, description: 'Save 10% on next visit' },
          { id: 'reward-002', name: 'Free Exam', pointsCost: 200, description: 'One free wellness exam' },
        ],
      },
    }).as('getRewards');

    cy.get('.rewards-section').should('be.visible');
    cy.wait('@getRewards');
    cy.get('.reward-item').should('have.length', 2);
  });

  it('should allow redeeming rewards', () => {
    cy.intercept('GET', '/api/loyalty/rewards', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'reward-001', name: '10% Discount', pointsCost: 100 },
        ],
      },
    });

    cy.intercept('GET', '/api/clients/client-001/loyalty', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { points: 250, tier: 'Silver' },
      },
    });

    cy.visit(`/clients/client-001/loyalty`);
    
    cy.intercept('POST', '/api/clients/client-001/loyalty/redeem', {
      statusCode: 200,
      body: { status: 'success', message: 'Reward redeemed' },
    }).as('redeemReward');

    cy.get('.btn-redeem-reward').first().click();
    cy.get('.confirm-modal').should('be.visible');
    cy.get('.btn-confirm').click();
    
    cy.wait('@redeemReward');
    cy.get('.success-message').should('contain', 'Reward redeemed');
  });

  it('should display tier progression', () => {
    cy.intercept('GET', '/api/clients/client-001/loyalty', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { points: 250, tier: 'Silver', nextTierPoints: 500 },
      },
    }).as('getLoyalty');

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
    
    cy.intercept('POST', '/api/clients/client-001/loyalty/add-points', {
      statusCode: 200,
      body: { status: 'success', data: { newBalance: 350 } },
    }).as('addPoints');

    cy.get('#points-amount').type('100');
    cy.get('#points-reason').type('Special promotion');
    cy.get('.btn-submit').click();
    
    cy.wait('@addPoints');
    cy.get('.success-message').should('contain', 'Points added');
  });

  it('should display redeemed rewards history', () => {
    cy.intercept('GET', '/api/clients/client-001/loyalty/redeemed', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 1, rewardName: '10% Discount', pointsCost: 100, redeemedDate: '2024-01-15' },
        ],
      },
    }).as('getRedeemedRewards');

    cy.get('.redeemed-rewards-section').should('be.visible');
    cy.wait('@getRedeemedRewards');
    cy.get('.redeemed-reward-item').should('have.length', 1);
  });
});

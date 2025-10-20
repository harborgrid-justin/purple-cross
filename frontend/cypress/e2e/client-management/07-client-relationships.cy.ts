/// <reference types="cypress" />

describe('Client Relationships Management', () => {
  // Using first client from seeded data
  const clientId = 'client-001';

  beforeEach(() => {
    cy.visit(`/clients/${clientId}/relationships`);
  });

  it('should display client relationships page', () => {
    cy.get('.page-header h1').should('contain', 'Client Relationships');
    cy.get('.relationships-section').should('be.visible');
  });

  it('should display patient ownership section', () => {
    cy.get('.patient-ownership-section').should('be.visible');
    cy.get('.patient-item').should('have.length', 2);
  });

  it('should allow adding a new pet to client', () => {
    cy.get('.btn-add-pet').click();
    cy.get('.add-pet-modal').should('be.visible');

    cy.get('#pet-name').type('Luna');
    cy.get('#pet-species').select('Dog');
    cy.get('.btn-save-pet').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Pet added successfully');
  });

  it('should display family relationships', () => {
    cy.get('.family-relationships-section').should('be.visible');
    cy.get('.family-relationships-section').should('contain', 'Family Members');
  });

  it('should allow adding family member', () => {
    cy.get('.btn-add-family-member').click();
    cy.get('.add-family-modal').should('be.visible');
    cy.get('#family-member-name').should('be.visible');
    cy.get('#family-relationship').should('be.visible');

    cy.get('#family-member-name').type('Jane Smith');
    cy.get('#family-relationship').select('Spouse');
    cy.get('.btn-save-family').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Family member added');
  });

  it('should display emergency contacts', () => {
    cy.get('.emergency-contacts-section').should('be.visible');
    cy.get('.emergency-contact-item').should('have.length', 1);
  });

  it('should display referral information', () => {
    cy.get('.referral-section').should('be.visible');
    cy.get('.referral-section').should('contain', 'Referral Information');
  });
});

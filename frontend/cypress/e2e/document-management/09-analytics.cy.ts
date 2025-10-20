/// <reference types="cypress" />

describe('Document Analytics', () => {
  it('should display the analytics page title', () => {
    cy.visitDocumentsPage('analytics');
    cy.get('.page-header h1').should('contain', 'Document Analytics');
  });

  it('should display analytics information cards', () => {
    cy.visitDocumentsPage('analytics');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards > div').should('have.length', 3);
  });

  it('should display metrics features card', () => {
    cy.visitDocumentsPage('analytics');
    cy.contains('h3', 'Metrics').should('be.visible');
    cy.contains('Storage usage').should('be.visible');
    cy.contains('Document counts').should('be.visible');
    cy.contains('User activity').should('be.visible');
    cy.contains('Access patterns').should('be.visible');
  });

  it('should display reports features card', () => {
    cy.visitDocumentsPage('analytics');
    cy.contains('h3', 'Reports').should('be.visible');
    cy.contains('Usage reports').should('be.visible');
    cy.contains('Compliance reports').should('be.visible');
    cy.contains('Activity reports').should('be.visible');
    cy.contains('Audit reports').should('be.visible');
  });

  it('should display insights features card', () => {
    cy.visitDocumentsPage('analytics');
    cy.contains('h3', 'Insights').should('be.visible');
    cy.contains('Popular documents').should('be.visible');
    cy.contains('Inactive documents').should('be.visible');
    cy.contains('Collaboration patterns').should('be.visible');
    cy.contains('Storage trends').should('be.visible');
  });

  it('should have proper page structure', () => {
    cy.visitDocumentsPage('analytics');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display content section description', () => {
    cy.visitDocumentsPage('analytics');
    cy.get('.content-section p').should('contain', 'Usage analytics and insights');
  });

  it('should display all feature items in lists', () => {
    cy.visitDocumentsPage('analytics');
    cy.get('.info-cards ul li').should('have.length', 12); // 4 + 4 + 4
  });

  it('should display proper semantic HTML structure', () => {
    cy.visitDocumentsPage('analytics');
    cy.get('header.page-header').should('exist');
    cy.get('h1').should('exist');
    cy.get('h3').should('have.length.at.least', 3);
    cy.get('ul').should('have.length.at.least', 3);
  });
});

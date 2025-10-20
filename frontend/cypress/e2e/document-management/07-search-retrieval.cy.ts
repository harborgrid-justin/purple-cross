/// <reference types="cypress" />

describe('Search & Retrieval', () => {
  it('should display the search retrieval page title', () => {
    cy.visitDocumentsPage('search');
    cy.get('.page-header h1').should('contain', 'Search & Retrieval');
  });

  it('should display search information cards', () => {
    cy.visitDocumentsPage('search');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards > div').should('have.length', 3);
  });

  it('should display search features card', () => {
    cy.visitDocumentsPage('search');
    cy.contains('h3', 'Search').should('be.visible');
    cy.contains('Full-text search').should('be.visible');
    cy.contains('Metadata search').should('be.visible');
    cy.contains('Advanced filters').should('be.visible');
    cy.contains('Boolean operators').should('be.visible');
  });

  it('should display features card', () => {
    cy.visitDocumentsPage('search');
    cy.contains('h3', 'Features').should('be.visible');
    cy.contains('Auto-suggestions').should('be.visible');
    cy.contains('Spell check').should('be.visible');
    cy.contains('Synonyms').should('be.visible');
    cy.contains('Fuzzy matching').should('be.visible');
  });

  it('should display results features card', () => {
    cy.visitDocumentsPage('search');
    cy.contains('h3', 'Results').should('be.visible');
    cy.contains('Relevance ranking').should('be.visible');
    cy.contains('Quick preview').should('be.visible');
    cy.contains('Highlighting').should('be.visible');
    cy.contains('Batch operations').should('be.visible');
  });

  it('should have proper page structure', () => {
    cy.visitDocumentsPage('search');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display content section description', () => {
    cy.visitDocumentsPage('search');
    cy.get('.content-section p').should('contain', 'Full-text search and document retrieval');
  });

  it('should have cards with proper styling', () => {
    cy.visitDocumentsPage('search');
    cy.get('.info-cards > div').first().should('have.css', 'padding');
    cy.get('.info-cards > div').first().should('have.css', 'background-color');
    cy.get('.info-cards > div').first().should('have.css', 'border-radius');
  });

  it('should display all feature items in lists', () => {
    cy.visitDocumentsPage('search');
    cy.get('.info-cards ul li').should('have.length', 12); // 4 + 4 + 4
  });

  it('should navigate back to documents from search page', () => {
    cy.visitDocumentsPage('search');
    cy.visit('/documents');
    cy.url().should('include', '/documents');
  });

  it('should maintain consistent layout across viewport sizes', () => {
    cy.visitDocumentsPage('search');
    cy.viewport(1280, 720);
    cy.get('.info-cards').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('.info-cards').should('be.visible');
  });

  it('should display proper semantic HTML structure', () => {
    cy.visitDocumentsPage('search');
    cy.get('header.page-header').should('exist');
    cy.get('h1').should('exist');
    cy.get('h3').should('have.length.at.least', 3);
    cy.get('ul').should('have.length.at.least', 3);
  });
});

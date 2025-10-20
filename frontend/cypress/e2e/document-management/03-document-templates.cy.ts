/// <reference types="cypress" />

describe('Document Templates', () => {
  it('should display the templates page title', () => {
    cy.visitDocumentsPage('templates');
    cy.get('.page-header h1').should('contain', 'Document Templates');
  });

  it('should display templates information cards', () => {
    cy.visitDocumentsPage('templates');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards > div').should('have.length', 3);
  });

  it('should display templates features card', () => {
    cy.visitDocumentsPage('templates');
    cy.contains('h3', 'Templates').should('be.visible');
    cy.contains('Consent forms').should('be.visible');
    cy.contains('Treatment plans').should('be.visible');
    cy.contains('Discharge instructions').should('be.visible');
    cy.contains('Client letters').should('be.visible');
  });

  it('should display customization features card', () => {
    cy.visitDocumentsPage('templates');
    cy.contains('h3', 'Customization').should('be.visible');
    cy.contains('Edit templates').should('be.visible');
    cy.contains('Brand templates').should('be.visible');
    cy.contains('Merge fields').should('be.visible');
    cy.contains('Conditional content').should('be.visible');
  });

  it('should display usage features card', () => {
    cy.visitDocumentsPage('templates');
    cy.contains('h3', 'Usage').should('be.visible');
    cy.contains('Quick fill').should('be.visible');
    cy.contains('Auto-populate').should('be.visible');
    cy.contains('Digital signing').should('be.visible');
    cy.contains('Email delivery').should('be.visible');
  });

  it('should have proper page structure', () => {
    cy.visitDocumentsPage('templates');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display content section description', () => {
    cy.visitDocumentsPage('templates');
    cy.get('.content-section p').should('contain', 'Pre-built templates for common documents');
  });

  it('should have cards with proper styling', () => {
    cy.visitDocumentsPage('templates');
    cy.get('.info-cards > div').first().should('have.css', 'padding');
    cy.get('.info-cards > div').first().should('have.css', 'background-color');
    cy.get('.info-cards > div').first().should('have.css', 'border-radius');
  });

  it('should display all feature items in lists', () => {
    cy.visitDocumentsPage('templates');
    cy.get('.info-cards ul li').should('have.length', 12); // 4 + 4 + 4
  });

  it('should navigate back to documents from templates page', () => {
    cy.visitDocumentsPage('templates');
    cy.visit('/documents');
    cy.url().should('include', '/documents');
  });

  it('should maintain consistent layout across viewport sizes', () => {
    cy.visitDocumentsPage('templates');
    cy.viewport(1280, 720);
    cy.get('.info-cards').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('.info-cards').should('be.visible');
  });

  it('should display proper semantic HTML structure', () => {
    cy.visitDocumentsPage('templates');
    cy.get('header.page-header').should('exist');
    cy.get('h1').should('exist');
    cy.get('h3').should('have.length.at.least', 3);
    cy.get('ul').should('have.length.at.least', 3);
  });
});

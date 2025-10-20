/// <reference types="cypress" />

describe('Document Storage', () => {
  it('should display the document storage page title', () => {
    cy.visitDocumentsPage('storage');
    cy.get('.page-header h1').should('contain', 'Document Storage');
  });

  it('should display storage information cards', () => {
    cy.visitDocumentsPage('storage');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards > div').should('have.length', 3);
  });

  it('should display storage features card', () => {
    cy.visitDocumentsPage('storage');
    cy.contains('h3', 'Storage').should('be.visible');
    cy.contains('Unlimited storage').should('be.visible');
    cy.contains('Cloud backup').should('be.visible');
    cy.contains('Version control').should('be.visible');
    cy.contains('Automatic sync').should('be.visible');
  });

  it('should display organization features card', () => {
    cy.visitDocumentsPage('storage');
    cy.contains('h3', 'Organization').should('be.visible');
    cy.contains('Folders').should('be.visible');
    cy.contains('Tags').should('be.visible');
    cy.contains('Categories').should('be.visible');
    cy.contains('Smart collections').should('be.visible');
  });

  it('should display security features card', () => {
    cy.visitDocumentsPage('storage');
    cy.contains('h3', 'Security').should('be.visible');
    cy.contains('Encryption').should('be.visible');
    cy.contains('Access controls').should('be.visible');
    cy.contains('Audit trails').should('be.visible');
    cy.contains('Compliance').should('be.visible');
  });

  it('should have proper page structure', () => {
    cy.visitDocumentsPage('storage');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display content section description', () => {
    cy.visitDocumentsPage('storage');
    cy.get('.content-section p').should('contain', 'Secure cloud-based document storage and management');
  });

  it('should have cards with proper styling', () => {
    cy.visitDocumentsPage('storage');
    cy.get('.info-cards > div').first().should('have.css', 'padding');
    cy.get('.info-cards > div').first().should('have.css', 'background-color');
    cy.get('.info-cards > div').first().should('have.css', 'border-radius');
  });

  it('should display all feature items in lists', () => {
    cy.visitDocumentsPage('storage');
    cy.get('.info-cards ul li').should('have.length', 12); // 4 + 4 + 4
  });

  it('should navigate back to documents from storage page', () => {
    cy.visitDocumentsPage('storage');
    cy.visit('/documents');
    cy.url().should('include', '/documents');
  });

  it('should maintain consistent layout across viewport sizes', () => {
    cy.visitDocumentsPage('storage');
    cy.viewport(1280, 720);
    cy.get('.info-cards').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('.info-cards').should('be.visible');
  });

  it('should display proper semantic HTML structure', () => {
    cy.visitDocumentsPage('storage');
    cy.get('header.page-header').should('exist');
    cy.get('h1').should('exist');
    cy.get('h3').should('have.length.at.least', 3);
    cy.get('ul').should('have.length.at.least', 3);
  });
});

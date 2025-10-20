/// <reference types="cypress" />

describe('E-Signature', () => {
  it('should display the e-signature page title', () => {
    cy.visitDocumentsPage('e-signature');
    cy.get('.page-header h1').should('contain', 'E-Signature');
  });

  it('should display e-signature information cards', () => {
    cy.visitDocumentsPage('e-signature');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards > div').should('have.length', 3);
  });

  it('should display signing features card', () => {
    cy.visitDocumentsPage('e-signature');
    cy.contains('h3', 'Signing').should('be.visible');
    cy.contains('In-person signing').should('be.visible');
    cy.contains('Remote signing').should('be.visible');
    cy.contains('Bulk signing').should('be.visible');
    cy.contains('Sequential signing').should('be.visible');
  });

  it('should display compliance features card', () => {
    cy.visitDocumentsPage('e-signature');
    cy.contains('h3', 'Compliance').should('be.visible');
    cy.contains('ESIGN Act').should('be.visible');
    cy.contains('UETA').should('be.visible');
    cy.contains('Audit trails').should('be.visible');
    cy.contains('Tamper-proof').should('be.visible');
  });

  it('should display management features card', () => {
    cy.visitDocumentsPage('e-signature');
    cy.contains('h3', 'Management').should('be.visible');
    cy.contains('Track status').should('be.visible');
    cy.contains('Reminders').should('be.visible');
    cy.contains('Expiration').should('be.visible');
    cy.contains('Void/cancel').should('be.visible');
  });

  it('should have proper page structure', () => {
    cy.visitDocumentsPage('e-signature');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display content section description', () => {
    cy.visitDocumentsPage('e-signature');
    cy.get('.content-section p').should('contain', 'Legally binding electronic signatures');
  });

  it('should have cards with proper styling', () => {
    cy.visitDocumentsPage('e-signature');
    cy.get('.info-cards > div').first().should('have.css', 'padding');
    cy.get('.info-cards > div').first().should('have.css', 'background-color');
    cy.get('.info-cards > div').first().should('have.css', 'border-radius');
  });

  it('should display all feature items in lists', () => {
    cy.visitDocumentsPage('e-signature');
    cy.get('.info-cards ul li').should('have.length', 12); // 4 + 4 + 4
  });

  it('should navigate back to documents from e-signature page', () => {
    cy.visitDocumentsPage('e-signature');
    cy.visit('/documents');
    cy.url().should('include', '/documents');
  });

  it('should maintain consistent layout across viewport sizes', () => {
    cy.visitDocumentsPage('e-signature');
    cy.viewport(1280, 720);
    cy.get('.info-cards').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('.info-cards').should('be.visible');
  });

  it('should display proper semantic HTML structure', () => {
    cy.visitDocumentsPage('e-signature');
    cy.get('header.page-header').should('exist');
    cy.get('h1').should('exist');
    cy.get('h3').should('have.length.at.least', 3);
    cy.get('ul').should('have.length.at.least', 3);
  });
});

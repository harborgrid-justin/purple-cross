/// <reference types="cypress" />

describe('Document Scanning', () => {
  it('should display the document scanning page title', () => {
    cy.visitDocumentsPage('scanning');
    cy.get('.page-header h1').should('contain', 'Document Scanning');
  });

  it('should display scanning information cards', () => {
    cy.visitDocumentsPage('scanning');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards > div').should('have.length', 3);
  });

  it('should display scanning features card', () => {
    cy.visitDocumentsPage('scanning');
    cy.contains('h3', 'Scanning').should('be.visible');
    cy.contains('Flatbed scanning').should('be.visible');
    cy.contains('Sheet-fed scanning').should('be.visible');
    cy.contains('Mobile scanning').should('be.visible');
    cy.contains('Batch scanning').should('be.visible');
  });

  it('should display OCR features card', () => {
    cy.visitDocumentsPage('scanning');
    cy.contains('h3', 'OCR').should('be.visible');
    cy.contains('Text recognition').should('be.visible');
    cy.contains('Searchable PDFs').should('be.visible');
    cy.contains('Data extraction').should('be.visible');
    cy.contains('Multi-language').should('be.visible');
  });

  it('should display processing features card', () => {
    cy.visitDocumentsPage('scanning');
    cy.contains('h3', 'Processing').should('be.visible');
    cy.contains('Auto-crop').should('be.visible');
    cy.contains('Deskew').should('be.visible');
    cy.contains('Enhancement').should('be.visible');
    cy.contains('Compression').should('be.visible');
  });

  it('should have proper page structure', () => {
    cy.visitDocumentsPage('scanning');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display content section description', () => {
    cy.visitDocumentsPage('scanning');
    cy.get('.content-section p').should('contain', 'OCR and document digitization');
  });

  it('should display all feature items in lists', () => {
    cy.visitDocumentsPage('scanning');
    cy.get('.info-cards ul li').should('have.length', 12); // 4 + 4 + 4
  });

  it('should maintain consistent layout across viewport sizes', () => {
    cy.visitDocumentsPage('scanning');
    cy.viewport(1280, 720);
    cy.get('.info-cards').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('.info-cards').should('be.visible');
  });

  it('should display proper semantic HTML structure', () => {
    cy.visitDocumentsPage('scanning');
    cy.get('header.page-header').should('exist');
    cy.get('h1').should('exist');
    cy.get('h3').should('have.length.at.least', 3);
    cy.get('ul').should('have.length.at.least', 3);
  });
});

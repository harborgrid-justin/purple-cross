/// <reference types="cypress" />

describe('Document Workflow', () => {
  it('should display the workflow page title', () => {
    cy.visitDocumentsPage('workflow');
    cy.get('.page-header h1').should('contain', 'Document Workflow');
  });

  it('should display workflow information cards', () => {
    cy.visitDocumentsPage('workflow');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards > div').should('have.length', 3);
  });

  it('should display workflows features card', () => {
    cy.visitDocumentsPage('workflow');
    cy.contains('h3', 'Workflows').should('be.visible');
    cy.contains('Approval routing').should('be.visible');
    cy.contains('Multi-step approvals').should('be.visible');
    cy.contains('Parallel approvals').should('be.visible');
    cy.contains('Conditional routing').should('be.visible');
  });

  it('should display automation features card', () => {
    cy.visitDocumentsPage('workflow');
    cy.contains('h3', 'Automation').should('be.visible');
    cy.contains('Auto-routing').should('be.visible');
    cy.contains('Email notifications').should('be.visible');
    cy.contains('Deadline reminders').should('be.visible');
    cy.contains('Escalations').should('be.visible');
  });

  it('should display tracking features card', () => {
    cy.visitDocumentsPage('workflow');
    cy.contains('h3', 'Tracking').should('be.visible');
    cy.contains('Status tracking').should('be.visible');
    cy.contains('Audit logs').should('be.visible');
    cy.contains('Performance metrics').should('be.visible');
    cy.contains('Bottleneck analysis').should('be.visible');
  });

  it('should have proper page structure', () => {
    cy.visitDocumentsPage('workflow');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display content section description', () => {
    cy.visitDocumentsPage('workflow');
    cy.get('.content-section p').should('contain', 'Automated document routing and approval workflows');
  });

  it('should have cards with proper styling', () => {
    cy.visitDocumentsPage('workflow');
    cy.get('.info-cards > div').first().should('have.css', 'padding');
    cy.get('.info-cards > div').first().should('have.css', 'background-color');
    cy.get('.info-cards > div').first().should('have.css', 'border-radius');
  });

  it('should display all feature items in lists', () => {
    cy.visitDocumentsPage('workflow');
    cy.get('.info-cards ul li').should('have.length', 12); // 4 + 4 + 4
  });

  it('should navigate back to documents from workflow page', () => {
    cy.visitDocumentsPage('workflow');
    cy.visit('/documents');
    cy.url().should('include', '/documents');
  });

  it('should maintain consistent layout across viewport sizes', () => {
    cy.visitDocumentsPage('workflow');
    cy.viewport(1280, 720);
    cy.get('.info-cards').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('.info-cards').should('be.visible');
  });

  it('should display proper semantic HTML structure', () => {
    cy.visitDocumentsPage('workflow');
    cy.get('header.page-header').should('exist');
    cy.get('h1').should('exist');
    cy.get('h3').should('have.length.at.least', 3);
    cy.get('ul').should('have.length.at.least', 3);
  });
});

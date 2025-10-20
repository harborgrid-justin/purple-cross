/// <reference types="cypress" />

describe('Access Control', () => {
  it('should display the access control page title', () => {
    cy.visitDocumentsPage('access-control');
    cy.get('.page-header h1').should('contain', 'Access Control');
  });

  it('should display access control information cards', () => {
    cy.visitDocumentsPage('access-control');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards > div').should('have.length', 3);
  });

  it('should display permissions features card', () => {
    cy.visitDocumentsPage('access-control');
    cy.contains('h3', 'Permissions').should('be.visible');
    cy.contains('User permissions').should('be.visible');
    cy.contains('Role-based access').should('be.visible');
    cy.contains('Document-level security').should('be.visible');
    cy.contains('Field-level security').should('be.visible');
  });

  it('should display sharing features card', () => {
    cy.visitDocumentsPage('access-control');
    cy.contains('h3', 'Sharing').should('be.visible');
    cy.contains('Internal sharing').should('be.visible');
    cy.contains('External sharing').should('be.visible');
    cy.contains('Link sharing').should('be.visible');
    cy.contains('Expiring links').should('be.visible');
  });

  it('should display monitoring features card', () => {
    cy.visitDocumentsPage('access-control');
    cy.contains('h3', 'Monitoring').should('be.visible');
    cy.contains('Access logs').should('be.visible');
    cy.contains('Download tracking').should('be.visible');
    cy.contains('Print tracking').should('be.visible');
    cy.contains('Modification tracking').should('be.visible');
  });

  it('should have proper page structure', () => {
    cy.visitDocumentsPage('access-control');
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });

  it('should display content section description', () => {
    cy.visitDocumentsPage('access-control');
    cy.get('.content-section p').should('contain', 'Granular permissions and security controls');
  });

  it('should display all feature items in lists', () => {
    cy.visitDocumentsPage('access-control');
    cy.get('.info-cards ul li').should('have.length', 12); // 4 + 4 + 4
  });

  it('should maintain consistent layout across viewport sizes', () => {
    cy.visitDocumentsPage('access-control');
    cy.viewport(1280, 720);
    cy.get('.info-cards').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('.info-cards').should('be.visible');
  });

  it('should display proper semantic HTML structure', () => {
    cy.visitDocumentsPage('access-control');
    cy.get('header.page-header').should('exist');
    cy.get('h1').should('exist');
    cy.get('h3').should('have.length.at.least', 3);
    cy.get('ul').should('have.length.at.least', 3);
  });
});

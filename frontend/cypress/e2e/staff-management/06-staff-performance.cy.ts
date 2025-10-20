/// <reference types="cypress" />

describe('Performance Management', () => {
  it.skip('should display the performance page title', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.visitStaffPage('performance');
    cy.get('.page-header h1').should('contain', 'Performance Management');
  });

  it.skip('should display page description', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.visitStaffPage('performance');
    cy.contains('Track and manage employee performance').should('be.visible');
  });

  it.skip('should display Reviews card', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.visitStaffPage('performance');
    cy.contains('h3', 'Reviews').should('be.visible');
    cy.contains('Performance reviews').should('be.visible');
    cy.contains('Goal setting').should('be.visible');
    cy.contains('360 feedback').should('be.visible');
    cy.contains('Self-assessments').should('be.visible');
  });

  it.skip('should display Metrics card', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.visitStaffPage('performance');
    cy.contains('h3', 'Metrics').should('be.visible');
    cy.contains('KPIs').should('be.visible');
    cy.contains('Productivity').should('be.visible');
    cy.contains('Quality scores').should('be.visible');
    cy.contains('Client feedback').should('be.visible');
  });

  it.skip('should display Development card', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.visitStaffPage('performance');
    cy.contains('h3', 'Development').should('be.visible');
    cy.contains('Performance plans').should('be.visible');
    cy.contains('Training needs').should('be.visible');
    cy.contains('Career planning').should('be.visible');
    cy.contains('Succession planning').should('be.visible');
  });

  it.skip('should have proper grid layout for info cards', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.visitStaffPage('performance');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it.skip('should navigate back to all staff from performance page', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.visitStaffPage('performance');
    cy.contains('.sub-nav-link', 'All Staff').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/staff');
  });

  it.skip('should highlight active navigation link', () => {
    // Skipped: Advanced staff management feature not yet fully implemented 
    cy.visitStaffPage('performance');
    cy.contains('.sub-nav-link', 'Performance Management').should('have.class', 'active');
    cy.contains('.sub-nav-link', 'All Staff').should('not.have.class', 'active');
  });
});

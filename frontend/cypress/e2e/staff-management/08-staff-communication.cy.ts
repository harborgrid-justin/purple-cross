/// <reference types="cypress" />

describe('Internal Communication', () => {
  it('should display the communication page title', () => {
    cy.visitStaffPage('communication');
    cy.get('.page-header h1').should('contain', 'Internal Communication');
  });

  it('should display page description', () => {
    cy.visitStaffPage('communication');
    cy.contains('Team communication and collaboration tools').should('be.visible');
  });

  it('should display Messaging card', () => {
    cy.visitStaffPage('communication');
    cy.contains('h3', 'Messaging').should('be.visible');
    cy.contains('Direct messages').should('be.visible');
    cy.contains('Team channels').should('be.visible');
    cy.contains('Announcements').should('be.visible');
    cy.contains('File sharing').should('be.visible');
  });

  it('should display Meetings card', () => {
    cy.visitStaffPage('communication');
    cy.contains('h3', 'Meetings').should('be.visible');
    cy.contains('Meeting schedules').should('be.visible');
    cy.contains('Meeting notes').should('be.visible');
    cy.contains('Action items').should('be.visible');
    cy.contains('Follow-ups').should('be.visible');
  });

  it('should display Updates card', () => {
    cy.visitStaffPage('communication');
    cy.contains('h3', 'Updates').should('be.visible');
    cy.contains('News feed').should('be.visible');
    cy.contains('Policy updates').should('be.visible');
    cy.contains('Training materials').should('be.visible');
    cy.contains('Best practices').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitStaffPage('communication');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should navigate back to all staff from communication page', () => {
    cy.visitStaffPage('communication');
    cy.contains('.sub-nav-link', 'All Staff').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/staff');
  });

  it('should highlight active navigation link', () => {
    cy.visitStaffPage('communication');
    cy.contains('.sub-nav-link', 'Internal Communication').should('have.class', 'active');
    cy.contains('.sub-nav-link', 'All Staff').should('not.have.class', 'active');
  });
});

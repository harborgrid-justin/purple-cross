/// <reference types="cypress" />

describe('Continuing Education', () => {
  it('should display the education page title', () => {
    cy.visitStaffPage('education');
    cy.get('.page-header h1').should('contain', 'Continuing Education');
  });

  it('should display page description', () => {
    cy.visitStaffPage('education');
    cy.contains('Track CE credits and professional development').should('be.visible');
  });

  it('should display CE Management card', () => {
    cy.visitStaffPage('education');
    cy.contains('h3', 'CE Management').should('be.visible');
    cy.contains('Credit tracking').should('be.visible');
    cy.contains('License requirements').should('be.visible');
    cy.contains('Renewal deadlines').should('be.visible');
    cy.contains('Course catalog').should('be.visible');
  });

  it('should display Learning card', () => {
    cy.visitStaffPage('education');
    cy.contains('h3', 'Learning').should('be.visible');
    cy.contains('Online courses').should('be.visible');
    cy.contains('Webinars').should('be.visible');
    cy.contains('Conferences').should('be.visible');
    cy.contains('In-house training').should('be.visible');
  });

  it('should display Compliance card', () => {
    cy.visitStaffPage('education');
    cy.contains('h3', 'Compliance').should('be.visible');
    cy.contains('State requirements').should('be.visible');
    cy.contains('Professional associations').should('be.visible');
    cy.contains('Specialty certifications').should('be.visible');
    cy.contains('Documentation').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitStaffPage('education');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should navigate back to all staff from education page', () => {
    cy.visitStaffPage('education');
    cy.contains('.sub-nav-link', 'All Staff').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/staff');
  });

  it('should highlight active navigation link', () => {
    cy.visitStaffPage('education');
    cy.contains('.sub-nav-link', 'Continuing Education').should('have.class', 'active');
    cy.contains('.sub-nav-link', 'All Staff').should('not.have.class', 'active');
  });
});

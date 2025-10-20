/// <reference types="cypress" />

describe('Shift Scheduling', () => {
  it('should display the scheduling page title', () => {
    cy.visitStaffPage('scheduling');
    cy.get('.page-header h1').should('contain', 'Shift Scheduling');
  });

  it('should display page description', () => {
    cy.visitStaffPage('scheduling');
    cy.contains('Create and manage employee work schedules').should('be.visible');
  });

  it('should display Scheduling card', () => {
    cy.visitStaffPage('scheduling');
    cy.contains('h3', 'Scheduling').should('be.visible');
    cy.contains('Shift creation').should('be.visible');
    cy.contains('Shift templates').should('be.visible');
    cy.contains('Recurring shifts').should('be.visible');
    cy.contains('Shift swaps').should('be.visible');
  });

  it('should display Coverage card', () => {
    cy.visitStaffPage('scheduling');
    cy.contains('h3', 'Coverage').should('be.visible');
    cy.contains('Availability').should('be.visible');
    cy.contains('Time-off requests').should('be.visible');
    cy.contains('Coverage gaps').should('be.visible');
    cy.contains('On-call schedules').should('be.visible');
  });

  it('should display Notifications card', () => {
    cy.visitStaffPage('scheduling');
    cy.contains('h3', 'Notifications').should('be.visible');
    cy.contains('Schedule changes').should('be.visible');
    cy.contains('Shift reminders').should('be.visible');
    cy.contains('Coverage alerts').should('be.visible');
    cy.contains('Overtime alerts').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitStaffPage('scheduling');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should navigate back to all staff from scheduling page', () => {
    cy.visitStaffPage('scheduling');
    cy.contains('.sub-nav-link', 'All Staff').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/staff');
  });

  it('should highlight active navigation link', () => {
    cy.visitStaffPage('scheduling');
    cy.contains('.sub-nav-link', 'Shift Scheduling').should('have.class', 'active');
    cy.contains('.sub-nav-link', 'All Staff').should('not.have.class', 'active');
  });

  it('should display all scheduling features', () => {
    cy.visitStaffPage('scheduling');
    
    const expectedFeatures = [
      'Shift creation',
      'Shift templates',
      'Recurring shifts',
      'Shift swaps'
    ];
    
    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should display all coverage features', () => {
    cy.visitStaffPage('scheduling');
    
    const expectedFeatures = [
      'Availability',
      'Time-off requests',
      'Coverage gaps',
      'On-call schedules'
    ];
    
    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });
});

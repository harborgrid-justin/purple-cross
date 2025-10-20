/// <reference types="cypress" />

describe('Time & Attendance', () => {
  it('should display the attendance page title', () => {
    cy.visitStaffPage('attendance');
    cy.get('.page-header h1').should('contain', 'Time & Attendance');
  });

  it('should display page description', () => {
    cy.visitStaffPage('attendance');
    cy.contains('Track employee time and attendance').should('be.visible');
  });

  it('should display Time Tracking card', () => {
    cy.visitStaffPage('attendance');
    cy.contains('h3', 'Time Tracking').should('be.visible');
    cy.contains('Clock in/out').should('be.visible');
    cy.contains('Break tracking').should('be.visible');
    cy.contains('Overtime').should('be.visible');
    cy.contains('PTO tracking').should('be.visible');
  });

  it('should display Reporting card', () => {
    cy.visitStaffPage('attendance');
    cy.contains('h3', 'Reporting').should('be.visible');
    cy.contains('Timesheet reports').should('be.visible');
    cy.contains('Attendance reports').should('be.visible');
    cy.contains('Absence tracking').should('be.visible');
    cy.contains('Tardiness reports').should('be.visible');
  });

  it('should display Integration card', () => {
    cy.visitStaffPage('attendance');
    cy.contains('h3', 'Integration').should('be.visible');
    cy.contains('Payroll systems').should('be.visible');
    cy.contains('HR systems').should('be.visible');
    cy.contains('Biometric systems').should('be.visible');
    cy.contains('Mobile apps').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitStaffPage('attendance');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should navigate back to all staff from attendance page', () => {
    cy.visitStaffPage('attendance');
    cy.contains('.sub-nav-link', 'All Staff').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/staff');
  });

  it('should highlight active navigation link', () => {
    cy.visitStaffPage('attendance');
    cy.contains('.sub-nav-link', 'Time & Attendance').should('have.class', 'active');
    cy.contains('.sub-nav-link', 'All Staff').should('not.have.class', 'active');
  });

  it('should display all time tracking features', () => {
    cy.visitStaffPage('attendance');
    
    const expectedFeatures = [
      'Clock in/out',
      'Break tracking',
      'Overtime',
      'PTO tracking'
    ];
    
    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it('should display all reporting features', () => {
    cy.visitStaffPage('attendance');
    
    const expectedFeatures = [
      'Timesheet reports',
      'Attendance reports',
      'Absence tracking',
      'Tardiness reports'
    ];
    
    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });
});

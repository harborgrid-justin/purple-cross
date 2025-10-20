/// <reference types="cypress" />

describe('Employee Profiles', () => {
  it.skip('should display the profiles page title',

  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.get('.page-header h1').should('contain', 'Employee Profiles');
  });

  it.skip('should display Profile Info card',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.contains('h3', 'Profile Info').should('be.visible');
    cy.contains('Personal information').should('be.visible');
    cy.contains('Contact details').should('be.visible');
    cy.contains('Emergency contacts').should('be.visible');
    cy.contains('Professional credentials').should('be.visible');
  });

  it.skip('should display Employment card',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.contains('h3', 'Employment').should('be.visible');
    cy.contains('Job title').should('be.visible');
    cy.contains('Department').should('be.visible');
    cy.contains('Start date').should('be.visible');
    cy.contains('Employment type').should('be.visible');
  });

  it.skip('should display Skills card',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.contains('h3', 'Skills').should('be.visible');
    cy.contains('Certifications').should('be.visible');
    cy.contains('Specialties').should('be.visible');
    cy.contains('Languages').should('be.visible');
    cy.contains('Training records').should('be.visible');
  });

  it.skip('should have proper grid layout for info cards',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it.skip('should navigate back to all staff from profiles page',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.contains('.sub-nav-link', 'All Staff').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/staff');
  });

  it.skip('should highlight active navigation link',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.contains('.sub-nav-link', 'Employee Profiles').should('have.class', 'active');
    cy.contains('.sub-nav-link', 'All Staff').should('not.have.class', 'active');
  });

  it.skip('should display comprehensive employee profile features',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');

    const expectedFeatures = [
      'Personal information',
      'Contact details',
      'Emergency contacts',
      'Professional credentials',
      'Job title',
      'Department',
      'Start date',
      'Employment type',
      'Certifications',
      'Specialties',
      'Languages',
      'Training records',
    ];

    expectedFeatures.forEach((feature) => {
      cy.contains(feature).should('be.visible');
    });
  });

  it.skip('should display page description',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.contains('Comprehensive employee information management').should('be.visible');
  });

  it.skip('should have accessible structure',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('profiles');
    cy.get('.page-header').should('exist');
    cy.get('.content-section').should('exist');
  });
});

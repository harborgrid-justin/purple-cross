/// <reference types="cypress" />

describe('Role-Based Access Control', () => {
  it('should display the access control page title', () => {
    cy.visitStaffPage('access-control');
    cy.get('.page-header h1').should('contain', 'Role-Based Access Control');
  });

  it('should display page description', () => {
    cy.visitStaffPage('access-control');
    cy.contains('Manage user permissions and access levels').should('be.visible');
  });

  it('should display Roles card', () => {
    cy.visitStaffPage('access-control');
    cy.contains('h3', 'Roles').should('be.visible');
    cy.contains('Veterinarian').should('be.visible');
    cy.contains('Technician').should('be.visible');
    cy.contains('Receptionist').should('be.visible');
    cy.contains('Administrator').should('be.visible');
  });

  it('should display Permissions card', () => {
    cy.visitStaffPage('access-control');
    cy.contains('h3', 'Permissions').should('be.visible');
    cy.contains('View rights').should('be.visible');
    cy.contains('Edit rights').should('be.visible');
    cy.contains('Delete rights').should('be.visible');
    cy.contains('Module access').should('be.visible');
  });

  it('should display Security card', () => {
    cy.visitStaffPage('access-control');
    cy.contains('h3', 'Security').should('be.visible');
    cy.contains('Password policies').should('be.visible');
    cy.contains('Two-factor auth').should('be.visible');
    cy.contains('Session management').should('be.visible');
    cy.contains('Audit logs').should('be.visible');
  });

  it('should have proper grid layout for info cards', () => {
    cy.visitStaffPage('access-control');
    cy.get('.info-cards').should('be.visible');
    cy.get('.info-cards').should('have.css', 'display', 'grid');
  });

  it('should navigate back to all staff from access control page', () => {
    cy.visitStaffPage('access-control');
    cy.contains('.sub-nav-link', 'All Staff').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/staff');
  });

  it('should highlight active navigation link', () => {
    cy.visitStaffPage('access-control');
    cy.contains('.sub-nav-link', 'Access Control').should('have.class', 'active');
    cy.contains('.sub-nav-link', 'All Staff').should('not.have.class', 'active');
  });

  it('should display all role types', () => {
    cy.visitStaffPage('access-control');

    const expectedRoles = ['Veterinarian', 'Technician', 'Receptionist', 'Administrator'];

    expectedRoles.forEach((role) => {
      cy.contains(role).should('be.visible');
    });
  });

  it('should display all permission types', () => {
    cy.visitStaffPage('access-control');

    const expectedPermissions = ['View rights', 'Edit rights', 'Delete rights', 'Module access'];

    expectedPermissions.forEach((permission) => {
      cy.contains(permission).should('be.visible');
    });
  });
});

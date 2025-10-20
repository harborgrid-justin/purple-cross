/// <reference types="cypress" />

describe('Staff List View', () => {
  it('should display the staff page title', () => {
    cy.visitStaff();
    cy.get('.page-header h1').should('contain', 'Staff Management');
  });

  it('should display the "Add Staff" button', () => {
    cy.visitStaff();
    cy.get('.btn-primary').should('contain', 'Add Staff');
    cy.get('.btn-primary').should('be.visible');
  });

  it('should display staff list table with correct headers', () => {
    cy.visitStaff();
    cy.get('.data-table', { timeout: 10000 }).should('be.visible');
    cy.get('.data-table thead th').should('have.length', 5);
    cy.get('.data-table thead th').eq(0).should('contain', 'Name');
    cy.get('.data-table thead th').eq(1).should('contain', 'Role');
    cy.get('.data-table thead th').eq(2).should('contain', 'Department');
    cy.get('.data-table thead th').eq(3).should('contain', 'Status');
    cy.get('.data-table thead th').eq(4).should('contain', 'Actions');
  });

  it('should display staff data in the table', () => {
    cy.visitStaff();
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 2);
    cy.get('.data-table tbody tr')
      .first()
      .within(() => {
        cy.get('th').should('contain', 'Dr. Emily Smith');
        cy.get('td').eq(0).should('contain', 'Veterinarian');
        cy.get('td').eq(1).should('contain', 'Surgery');
      });
  });

  it('should display action buttons for each staff member', () => {
    cy.visitStaff();
    cy.get('.data-table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.btn-action').should('have.length', 2);
        cy.get('.btn-action').eq(0).should('contain', 'View');
        cy.get('.btn-action').eq(1).should('contain', 'Edit');
      });
  });

  it('should display search input field', () => {
    cy.visitStaff();

    cy.get('#staff-search').should('be.visible');
    cy.get('#staff-search').should('have.attr', 'placeholder').and('include', 'Search staff');
  });

  it('should filter staff when searching', () => {
    cy.visitStaff();
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 2);
    cy.get('#staff-search').should('have.value', 'Emily');
  });

  it.skipit('should display "No staff found" message when list is empty', () => {
    cy.visitStaff();

    cy.contains('No staff found').should('be.visible');
  });

  it.skipit('should display loading state', () => {
    cy.visitStaff();
    cy.contains('Loading').should('be.visible');
  });

  it('should navigate to staff subpages via navigation', () => {
    cy.visitStaff();

    cy.get('.sub-nav-link').should('have.length.at.least', 8);
    cy.contains('.sub-nav-link', 'All Staff').should('have.class', 'active');

    cy.contains('.sub-nav-link', 'Employee Profiles').click();
    cy.url().should('include', '/staff/profiles');
  });

  it('should display proper ARIA labels for accessibility', () => {
    cy.visitStaff();
    cy.get('[role="table"]').should('exist');
    cy.get('.data-table', { timeout: 10000 }).should('exist');
    cy.get('[aria-label*="staff"]').should('exist');
    cy.get('.btn-primary').should('have.attr', 'aria-label');
  });

  it('should display status badges correctly', () => {
    cy.visitStaff();
    cy.get('.data-table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.status-badge').should('exist');
        cy.get('.status-badge').should('contain', 'Active');
      });
  });
});

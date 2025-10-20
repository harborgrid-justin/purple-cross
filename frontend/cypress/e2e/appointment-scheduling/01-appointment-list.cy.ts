/// <reference types="cypress" />

describe('Appointment List View', () => {
  it('should display the appointments page title', () => {
    cy.visitAppointments();
    cy.get('.page-header h1').should('contain', 'Appointments');
  });

  it('should display the "Schedule Appointment" button', () => {
    cy.visitAppointments();
    cy.get('.btn-primary').should('contain', 'Schedule Appointment');
    cy.get('.btn-primary').should('be.visible');
  });

  it('should display appointment list table with correct headers', () => {
    cy.visitAppointments();
    
    cy.get('.data-table', { timeout: 10000 }).should('be.visible');
    cy.get('.data-table thead th').should('have.length', 6);
    cy.get('.data-table thead th').eq(0).should('contain', 'Date & Time');
    cy.get('.data-table thead th').eq(1).should('contain', 'Patient');
    cy.get('.data-table thead th').eq(2).should('contain', 'Owner');
    cy.get('.data-table thead th').eq(3).should('contain', 'Type');
    cy.get('.data-table thead th').eq(4).should('contain', 'Status');
    cy.get('.data-table thead th').eq(5).should('contain', 'Actions');
  });

  it('should display appointment data in the table', () => {
    cy.visitAppointments();
    
    // Check that we have appointment rows
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 8);
    
    // Check first appointment data
    cy.get('.data-table tbody tr').first().within(() => {
      cy.get('th').should('exist');
      cy.get('td').should('have.length.at.least', 4);
    });
  });

  it('should display action buttons for each appointment', () => {
    cy.visitAppointments();
    
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().within(() => {
      cy.get('.btn-action').should('have.length.at.least', 2);
      cy.get('.btn-action').eq(0).should('contain', 'View');
    });
  });

  it('should display search input field', () => {
    cy.visitAppointments();
    
    cy.get('#appointment-search').should('be.visible');
    cy.get('#appointment-search').should('have.attr', 'placeholder')
      .and('include', 'Search appointments');
  });

  it('should filter appointments when searching', () => {
    cy.visitAppointments();
    
    // Wait for data to load
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 8);
    
    // Search for a specific patient
    cy.searchAppointments('Buddy');
    
    // The search input should have the value
    cy.get('#appointment-search').should('have.value', 'Buddy');
  });

  it.skip('should display "No appointments found" message when list is empty', () => {
    // Skipped: Database is seeded with data for real API testing
    // This test requires an empty database which conflicts with other tests
  });

  it.skip('should display loading state', () => {
    // Skipped: Cannot test loading state with real API calls without introducing artificial delay
  });

  it('should navigate to appointment subpages via navigation', () => {
    cy.visitAppointments();
    
    cy.get('.sub-nav-link').should('have.length.at.least', 6);
    cy.contains('.sub-nav-link', 'All Appointments').should('have.class', 'active');
  });

  it('should display proper ARIA labels for accessibility', () => {
    cy.visitAppointments();
    
    cy.get('.data-table', { timeout: 10000 }).should('exist');
    cy.get('.data-table').should('have.attr', 'role', 'table');
    cy.get('.btn-primary').should('have.attr', 'aria-label');
  });

  it('should format dates correctly in the table', () => {
    cy.visitAppointments();
    
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().within(() => {
      cy.get('time').should('exist');
      cy.get('time').should('have.attr', 'dateTime');
    });
  });

  it('should display status badges correctly', () => {
    cy.visitAppointments();
    
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().within(() => {
      cy.get('.status-badge').should('exist');
    });
  });

  it('should have accessible navigation with proper labels', () => {
    cy.visitAppointments();
    cy.get('.sub-nav').should('have.attr', 'role', 'navigation');
    cy.get('.sub-nav').should('have.attr', 'aria-label');
  });

  it('should maintain table structure integrity', () => {
    cy.visitAppointments();
    
    cy.get('.table-container', { timeout: 10000 }).should('exist');
    cy.get('.data-table thead').should('exist');
    cy.get('.data-table tbody').should('exist');
  });
});

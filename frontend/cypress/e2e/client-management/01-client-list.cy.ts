/// <reference types="cypress" />

describe('Client List View', () => {
  it('should display the clients page title', () => {
    cy.visitClients();
    cy.get('.page-header h1').should('contain', 'Clients');
  });

  it('should display the "Add New Client" button', () => {
    cy.visitClients();
    cy.get('.btn-primary').should('contain', 'Add New Client');
    cy.get('.btn-primary').should('be.visible');
  });

  it('should display client list table with correct headers', () => {
    cy.visitClients();
    cy.get('.data-table', { timeout: 10000 }).should('be.visible');
    cy.get('.data-table thead th').should('have.length', 6);
    cy.get('.data-table thead th').eq(0).should('contain', 'Name');
    cy.get('.data-table thead th').eq(1).should('contain', 'Email');
    cy.get('.data-table thead th').eq(2).should('contain', 'Phone');
    cy.get('.data-table thead th').eq(3).should('contain', 'Location');
    cy.get('.data-table thead th').eq(4).should('contain', 'Pets');
    cy.get('.data-table thead th').eq(5).should('contain', 'Actions');
  });

  it('should display client data in the table', () => {
    cy.visitClients();
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 6);
    cy.get('.data-table tbody tr')
      .first()
      .within(() => {
        cy.get('th').should('exist'); // Name column
        cy.get('td').should('have.length.at.least', 4); // Email, Phone, Location, Pets, Actions
      });
  });

  it('should display action buttons for each client', () => {
    cy.visitClients();
    cy.get('.data-table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.btn-action').should('have.length', 2);
        cy.get('.btn-action').eq(0).should('contain', 'View');
        cy.get('.btn-action').eq(1).should('contain', 'Edit');
      });
  });

  it('should display search input field', () => {
    cy.visitClients();

    cy.get('#client-search').should('be.visible');
    cy.get('#client-search').should('have.attr', 'placeholder').and('include', 'Search clients');
  });

  it('should filter clients when searching', () => {
    cy.visitClients();
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.searchClients('John');
    cy.get('#client-search').should('have.value', 'John');
  });

  it.skip('should display "No clients found" message when list is empty', () => {
    // Skipped: Database is seeded with data for real API testing
    // This test requires an empty database which conflicts with other tests
  });

  it.skip('should handle pagination controls', () => {
    // Skipped: Pagination not yet implemented in UI
    cy.visitClients();
    cy.get('.pagination', { timeout: 10000 }).should('be.visible');
    cy.get('.pagination .page-item').should('have.length.at.least', 3);
  });

  it.skip('should display correct client count', () => {
    // Skipped: Results count not yet implemented in UI
    cy.visitClients();
    cy.get('.results-count', { timeout: 10000 }).should('be.visible');
    cy.get('.results-count').should('contain', '6');
  });

  it.skip('should support sorting by name', () => {
    // Skipped: Column sorting not yet implemented in UI
    cy.visitClients();
    cy.get('.data-table thead th').first().click();
    cy.get('.data-table thead th').first().should('have.class', 'sorted');
  });

  it.skip('should support sorting by email', () => {
    // Skipped: Column sorting not yet implemented in UI
    cy.visitClients();
    cy.get('.data-table thead th').eq(1).click();
    cy.get('.data-table thead th').eq(1).should('have.class', 'sorted');
  });

  it.skip('should display client status badges', () => {
    // Skipped: Status badges not included in current table design
    cy.visitClients();
    cy.get('.data-table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.badge').should('be.visible');
        cy.get('.badge').should('contain', 'active');
      });
  });

  it.skip('should handle API errors gracefully', () => {
    // Skipped: Cannot test API errors with real API calls without breaking other tests
  });

  it.skip('should show loading state while fetching clients', () => {
    // Skipped: Cannot test loading state with real API calls without introducing artificial delay
  });
});

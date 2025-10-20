/// <reference types="cypress" />

describe('Client Search Functionality', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClients(clients);
    });
    cy.visitClients();
  });

  it('should search clients by first name', () => {
    cy.searchClients('John');
    cy.get('#client-search').should('have.value', 'John');
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('.data-table tbody tr').first().should('contain', 'John');
  });

  it('should search clients by last name', () => {
    cy.searchClients('Smith');
    cy.get('#client-search').should('have.value', 'Smith');
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('.data-table tbody tr').first().should('contain', 'Smith');
  });

  it('should search clients by email', () => {
    cy.searchClients('john.smith@email.com');
    cy.get('#client-search').should('have.value', 'john.smith@email.com');
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 1);
    cy.get('.data-table tbody tr').first().should('contain', 'john.smith@email.com');
  });

  it('should search clients by phone number', () => {
    cy.searchClients('555-0101');
    cy.get('#client-search').should('have.value', '555-0101');
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('.data-table tbody tr').first().should('contain', '555-0101');
  });

  it('should search clients by city', () => {
    cy.searchClients('Springfield');
    cy.get('#client-search').should('have.value', 'Springfield');
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it.skipit('should show "No results found" for non-existent search', () => {
    cy.searchClients('NonExistentClient123');
    cy.get('.empty-state', { timeout: 10000 }).should('be.visible');
    cy.get('.empty-state').should('contain', 'No clients found');
  });

  it('should clear search and show all clients', () => {
    cy.searchClients('John');
    cy.get('#client-search').clear();
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 6);
  });

  it('should support case-insensitive search', () => {
    cy.searchClients('JOHN');
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('.data-table tbody tr').first().should('contain', 'John');
  });

  it('should have advanced search filters', () => {
    cy.get('.btn-advanced-search').click();
    cy.get('.advanced-search-panel').should('be.visible');
    cy.get('#filterByStatus').should('be.visible');
    cy.get('#filterByCity').should('be.visible');
    cy.get('#filterByState').should('be.visible');
  });

  it('should filter by status in advanced search', () => {
    cy.get('.btn-advanced-search').click();
    cy.get('#filterByStatus').select('active');
    cy.get('.btn-apply-filters').click();
    
    cy.get('.data-table tbody tr', { timeout: 10000 }).each(($row) => {
      cy.wrap($row).find('.badge').should('contain', 'active');
    });
  });
});

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
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients },
      });
      cy.visitClients();
      
      cy.get('.data-table', { timeout: 10000 }).should('be.visible');
      cy.get('.data-table thead th').should('have.length', 6);
      cy.get('.data-table thead th').eq(0).should('contain', 'Name');
      cy.get('.data-table thead th').eq(1).should('contain', 'Email');
      cy.get('.data-table thead th').eq(2).should('contain', 'Phone');
      cy.get('.data-table thead th').eq(3).should('contain', 'City');
      cy.get('.data-table thead th').eq(4).should('contain', 'Status');
      cy.get('.data-table thead th').eq(5).should('contain', 'Actions');
    });
  });

  it('should display client data in the table', () => {
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients },
      });
      cy.visitClients();
      
      cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 6);
      
      cy.get('.data-table tbody tr').first().within(() => {
        cy.get('th').should('contain', 'John Smith');
        cy.get('td').eq(0).should('contain', 'john.smith@email.com');
        cy.get('td').eq(1).should('contain', '555-0101');
        cy.get('td').eq(2).should('contain', 'Springfield');
      });
    });
  });

  it('should display action buttons for each client', () => {
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients },
      });
      cy.visitClients();
      
      cy.get('.data-table tbody tr', { timeout: 10000 }).first().within(() => {
        cy.get('.btn-action').should('have.length', 2);
        cy.get('.btn-action').eq(0).should('contain', 'View');
        cy.get('.btn-action').eq(1).should('contain', 'Edit');
      });
    });
  });

  it('should display search input field', () => {
    cy.visitClients();
    
    cy.get('#client-search').should('be.visible');
    cy.get('#client-search').should('have.attr', 'placeholder')
      .and('include', 'Search clients');
  });

  it('should filter clients when searching', () => {
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients },
      });
      cy.visitClients();
      
      cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length', 6);
      
      cy.searchClients('John');
      
      cy.get('#client-search').should('have.value', 'John');
    });
  });

  it('should display "No clients found" message when list is empty', () => {
    cy.intercept('GET', '/api/clients*', {
      statusCode: 200,
      body: { status: 'success', data: [] },
    });
    cy.visitClients();
    
    cy.get('.empty-state', { timeout: 10000 }).should('be.visible');
    cy.get('.empty-state').should('contain', 'No clients found');
  });

  it('should handle pagination controls', () => {
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients, total: 50 },
      });
      cy.visitClients();
      
      cy.get('.pagination', { timeout: 10000 }).should('be.visible');
      cy.get('.pagination .page-item').should('have.length.at.least', 3);
    });
  });

  it('should display correct client count', () => {
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients, total: clients.length },
      });
      cy.visitClients();
      
      cy.get('.results-count', { timeout: 10000 }).should('be.visible');
      cy.get('.results-count').should('contain', '6');
    });
  });

  it('should support sorting by name', () => {
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients },
      });
      cy.visitClients();
      
      cy.get('.data-table thead th').first().click();
      cy.get('.data-table thead th').first().should('have.class', 'sorted');
    });
  });

  it('should support sorting by email', () => {
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients },
      });
      cy.visitClients();
      
      cy.get('.data-table thead th').eq(1).click();
      cy.get('.data-table thead th').eq(1).should('have.class', 'sorted');
    });
  });

  it('should display client status badges', () => {
    cy.fixture('clients').then((clients) => {
      cy.intercept('GET', '/api/clients*', {
        statusCode: 200,
        body: { status: 'success', data: clients },
      });
      cy.visitClients();
      
      cy.get('.data-table tbody tr', { timeout: 10000 }).first().within(() => {
        cy.get('.badge').should('be.visible');
        cy.get('.badge').should('contain', 'active');
      });
    });
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '/api/clients*', {
      statusCode: 500,
      body: { status: 'error', message: 'Server error' },
    });
    cy.visitClients();
    
    cy.get('.error-message', { timeout: 10000 }).should('be.visible');
    cy.get('.error-message').should('contain', 'error');
  });

  it('should show loading state while fetching clients', () => {
    cy.intercept('GET', '/api/clients*', {
      statusCode: 200,
      body: { status: 'success', data: [] },
      delay: 1000,
    });
    cy.visitClients();
    
    cy.get('.loading-spinner').should('be.visible');
  });
});

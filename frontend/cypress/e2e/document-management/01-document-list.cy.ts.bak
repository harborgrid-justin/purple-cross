/// <reference types="cypress" />

describe('Document List View', () => {
  it('should display the documents page title', () => {
    cy.visitDocuments();
    cy.get('.page-header h1').should('contain', 'Documents');
  });

  it('should display the "Upload Document" button', () => {
    cy.visitDocuments();
    cy.get('.btn-primary').should('contain', 'Upload Document');
    cy.get('.btn-primary').should('be.visible');
  });

  it('should display document list table with correct headers', () => {
    cy.fixture('documents').then((documents) => {
      cy.intercept('GET', '/api/documents*', {
        statusCode: 200,
        body: { status: 'success', data: documents },
      });
      cy.visitDocuments();
      
      cy.get('.data-table', { timeout: 10000 }).should('be.visible');
      cy.get('.data-table thead th').should('have.length', 5);
      cy.get('.data-table thead th').eq(0).should('contain', 'Document Name');
      cy.get('.data-table thead th').eq(1).should('contain', 'Type');
      cy.get('.data-table thead th').eq(2).should('contain', 'Date');
      cy.get('.data-table thead th').eq(3).should('contain', 'Status');
      cy.get('.data-table thead th').eq(4).should('contain', 'Actions');
    });
  });

  it('should display document data in the table', () => {
    cy.fixture('documents').then((documents) => {
      cy.intercept('GET', '/api/documents*', {
        statusCode: 200,
        body: { status: 'success', data: documents },
      });
      cy.visitDocuments();
      
      // Check that we have document rows
      cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
      
      // Check first document data
      cy.get('.data-table tbody tr').first().within(() => {
        cy.get('th').should('exist');
        cy.get('td').should('have.length.at.least', 3);
      });
    });
  });

  it('should display action buttons for each document', () => {
    cy.fixture('documents').then((documents) => {
      cy.intercept('GET', '/api/documents*', {
        statusCode: 200,
        body: { status: 'success', data: documents },
      });
      cy.visitDocuments();
      
      cy.get('.data-table tbody tr', { timeout: 10000 }).first().within(() => {
        cy.get('.btn-action').should('have.length', 2);
        cy.get('.btn-action').eq(0).should('contain', 'View');
        cy.get('.btn-action').eq(1).should('contain', 'Download');
      });
    });
  });

  it('should navigate to document subpages via navigation', () => {
    cy.visitDocuments();
    
    cy.get('.sub-nav-link').should('have.length.at.least', 9);
    cy.contains('.sub-nav-link', 'All Documents').should('have.class', 'active');
    
    cy.contains('.sub-nav-link', 'Document Storage').click();
    cy.url().should('include', '/documents/storage');
  });

  it('should display proper ARIA labels for accessibility', () => {
    cy.fixture('documents').then((documents) => {
      cy.intercept('GET', '/api/documents*', {
        statusCode: 200,
        body: { status: 'success', data: documents },
      });
      cy.visitDocuments();
      
      cy.get('.data-table', { timeout: 10000 }).should('exist');
      cy.get('.data-table').should('have.attr', 'role', 'table');
      cy.get('.data-table').should('have.attr', 'aria-label');
      cy.get('.btn-primary').should('have.attr', 'aria-label');
    });
  });

  it('should have proper page structure', () => {
    cy.visitDocuments();
    
    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.sub-nav').should('exist');
  });

  it('should display navigation with correct sections', () => {
    cy.visitDocuments();
    
    const expectedSections = [
      'All Documents',
      'Document Storage',
      'Templates',
      'E-Signature',
      'Document Scanning',
      'Workflow',
      'Search & Retrieval',
      'Access Control',
      'Analytics'
    ];
    
    expectedSections.forEach(section => {
      cy.contains('.sub-nav-link', section).should('exist');
    });
  });

  it('should display loading state', () => {
    cy.fixture('documents').then((documents) => {
      cy.intercept('GET', '/api/documents*', {
        delay: 1000,
        statusCode: 200,
        body: { status: 'success', data: documents },
      });
      cy.visitDocuments();
      cy.contains('Loading').should('be.visible');
    });
  });

  it('should highlight active navigation link', () => {
    cy.visitDocuments();
    cy.contains('.sub-nav-link', 'All Documents').should('have.class', 'active');
  });

  it('should have accessible action buttons with labels', () => {
    cy.fixture('documents').then((documents) => {
      cy.intercept('GET', '/api/documents*', {
        statusCode: 200,
        body: { status: 'success', data: documents },
      });
      cy.visitDocuments();
      
      cy.get('.data-table tbody tr', { timeout: 10000 }).first().within(() => {
        cy.get('.btn-action').each(($btn) => {
          cy.wrap($btn).should('have.attr', 'aria-label');
        });
      });
    });
  });

  it('should have navigation with proper ARIA labels', () => {
    cy.visitDocuments();
    cy.get('.sub-nav').should('have.attr', 'role', 'navigation');
    cy.get('.sub-nav').should('have.attr', 'aria-label');
  });

  it('should display all navigation links', () => {
    cy.visitDocuments();
    cy.get('.sub-nav-link').should('have.length.at.least', 9);
  });

  it('should maintain table structure integrity', () => {
    cy.fixture('documents').then((documents) => {
      cy.intercept('GET', '/api/documents*', {
        statusCode: 200,
        body: { status: 'success', data: documents },
      });
      cy.visitDocuments();
      
      cy.get('.table-container', { timeout: 10000 }).should('exist');
      cy.get('.data-table thead').should('exist');
      cy.get('.data-table tbody').should('exist');
    });
  });
});

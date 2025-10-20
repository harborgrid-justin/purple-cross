/// <reference types="cypress" />

describe('Document Compliance', () => {
  beforeEach(() => {
    cy.visitDocuments();
  });

  it('should display compliance status for documents', () => {
    cy.get('.data-table tbody tr').each(($row) => {
      cy.wrap($row).find('.compliance-badge').should('exist');
    });
  });

  it('should filter documents by compliance status', () => {
    cy.get('#compliance-filter').select('Compliant');
    cy.get('.data-table tbody tr').each(($row) => {
      cy.wrap($row).find('.compliance-badge').should('contain', 'Compliant');
    });
  });

  it('should show compliance checklist for required documents', () => {
    cy.visitDocumentsPage('compliance');
    cy.get('.compliance-checklist').should('be.visible');
    cy.get('.checklist-item').should('have.length.at.least', 5);
  });

  it('should highlight missing required documents', () => {
    cy.visitDocumentsPage('compliance');
    cy.get('.checklist-item.missing').should('be.visible');
    cy.get('.checklist-item.missing').should('have.class', 'alert-warning');
  });

  it('should display retention policy for each document type', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.retention-info').should('be.visible');
    cy.get('.retention-period').should('contain', 'year');
  });

  it('should warn before document retention expiration', () => {
    cy.visitDocumentsPage('retention-alerts');
    cy.get('.retention-alert').should('be.visible');
    cy.get('.expiring-soon').should('have.length.at.least', 1);
  });
});

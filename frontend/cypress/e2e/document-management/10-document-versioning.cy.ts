/// <reference types="cypress" />

describe('Document Versioning', () => {
  beforeEach(() => {
    cy.visitDocuments();
  });

  it('should display version history for a document', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.version-history-tab').click();
    cy.get('.version-list').should('be.visible');
    cy.get('.version-item').should('have.length.at.least', 1);
  });

  it('should show version number and timestamp', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.version-history-tab').click();
    cy.get('.version-item')
      .first()
      .within(() => {
        cy.get('.version-number').should('contain', 'v');
        cy.get('.version-date').should('be.visible');
        cy.get('.version-author').should('be.visible');
      });
  });

  it('should allow comparing two versions', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.version-history-tab').click();
    cy.get('.version-item').eq(0).find('input[type="checkbox"]').check();
    cy.get('.version-item').eq(1).find('input[type="checkbox"]').check();
    cy.get('.btn-compare-versions').should('be.enabled');
    cy.get('.btn-compare-versions').click();
    cy.get('.version-comparison').should('be.visible');
  });

  it('should allow reverting to a previous version', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.version-history-tab').click();
    cy.get('.version-item').eq(1).find('.btn-revert').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.confirm-dialog .btn-confirm').click();
    cy.get('.success-message').should('contain', 'Document reverted');
  });

  it('should create a new version when document is updated', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-edit').click();
    cy.get('#document-description').clear().type('Updated description');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('be.visible');
    cy.get('.version-history-tab').click();
    cy.get('.version-item').first().should('contain', 'v');
  });

  it('should display version diff highlights', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.version-history-tab').click();
    cy.get('.version-item').eq(0).find('input[type="checkbox"]').check();
    cy.get('.version-item').eq(1).find('input[type="checkbox"]').check();
    cy.get('.btn-compare-versions').click();
    cy.get('.diff-added').should('exist');
    cy.get('.diff-removed').should('exist');
  });

  it('should show who made changes in each version', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.version-history-tab').click();
    cy.get('.version-item').each(($item) => {
      cy.wrap($item).find('.version-author').should('not.be.empty');
    });
  });

  it('should allow downloading a specific version', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.version-history-tab').click();
    cy.get('.version-item').first().find('.btn-download-version').should('be.visible');
    cy.get('.version-item').first().find('.btn-download-version').click();
    // Verify download initiated
  });
});

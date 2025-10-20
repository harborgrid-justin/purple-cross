/// <reference types="cypress" />

describe('Document Sharing', () => {
  beforeEach(() => {
    cy.visitDocuments();
  });

  it('should display share button for a document', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-share').should('be.visible');
  });

  it('should open share dialog with sharing options', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-share').click();
    cy.get('.share-dialog').should('be.visible');
    cy.get('.share-options').should('be.visible');
  });

  it('should allow sharing with specific staff members', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-share').click();
    cy.get('#share-with-staff').type('Emily');
    cy.get('.staff-suggestion').first().click();
    cy.get('.selected-staff').should('contain', 'Emily');
    cy.get('.btn-confirm-share').click();
    cy.get('.success-message').should('contain', 'Document shared');
  });

  it('should allow setting permission levels when sharing', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-share').click();
    cy.get('#share-with-staff').type('John');
    cy.get('.staff-suggestion').first().click();
    cy.get('#permission-level').select('View Only');
    cy.get('.btn-confirm-share').click();
    cy.get('.success-message').should('be.visible');
  });

  it('should generate a shareable link', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-share').click();
    cy.get('.generate-link-tab').click();
    cy.get('.btn-generate-link').click();
    cy.get('.shareable-link').should('be.visible');
    cy.get('.btn-copy-link').should('be.enabled');
  });

  it('should allow setting expiration date for shared links', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-share').click();
    cy.get('.generate-link-tab').click();
    cy.get('#link-expiration').type('2024-12-31');
    cy.get('.btn-generate-link').click();
    cy.get('.shareable-link').should('be.visible');
    cy.get('.link-expires').should('contain', '2024-12-31');
  });

  it('should display list of people who have access', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.access-list-tab').click();
    cy.get('.access-list').should('be.visible');
    cy.get('.access-item').should('have.length.at.least', 1);
  });

  it('should allow revoking access from shared users', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.access-list-tab').click();
    cy.get('.access-item').first().find('.btn-revoke').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.confirm-dialog .btn-confirm').click();
    cy.get('.success-message').should('contain', 'Access revoked');
  });

  it('should send notification when document is shared', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-share').click();
    cy.get('#share-with-staff').type('Emily');
    cy.get('.staff-suggestion').first().click();
    cy.get('#send-notification').check();
    cy.get('.btn-confirm-share').click();
    cy.get('.success-message').should('contain', 'notification sent');
  });

  it('should track document access history', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.activity-log-tab').click();
    cy.get('.access-history').should('be.visible');
    cy.get('.access-event').should('have.length.at.least', 1);
    cy.get('.access-event').first().should('contain', 'accessed by');
  });
});

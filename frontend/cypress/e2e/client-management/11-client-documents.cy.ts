/// <reference types="cypress" />

describe('Client Documents Management', () => {
  // Using first client from seeded data
  const clientId = 'client-001';

  beforeEach(() => {
    cy.visit(`/clients/${clientId}/documents`);
  });

  it('should display client documents page', () => {
    cy.get('.page-header h1').should('contain', 'Client Documents');
    cy.get('.documents-section').should('be.visible');
  });

  it('should display client document list', () => {
    cy.get('.document-item').should('have.length', 2);
  });

  it.skipit('should allow uploading new document', () => {
    cy.get('.btn-upload-document').click();
    cy.get('.upload-modal').should('be.visible');

    cy.get('#document-title').type('New Document');
    cy.get('#document-category').select('contracts');
    cy.get('#document-file').selectFile('cypress/fixtures/test-document.pdf', { force: true });
    cy.get('.btn-upload').click();

    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Document uploaded');
  });

  it('should display consent forms section', () => {
    cy.get('.consent-forms-section').should('be.visible');

    cy.get('.consent-form-item').should('have.length.at.least', 1);
  });

  it('should allow requesting client signature on document', () => {
    cy.visit(`/clients/client-001/documents`);

    cy.get('.btn-request-signature').first().click();
    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Signature request sent');
  });

  it('should display signed documents with signature date', () => {
    cy.visit(`/clients/client-001/documents`);
    cy.get('.document-item')
      .first()
      .within(() => {
        cy.get('.signed-badge').should('be.visible');
        cy.get('.signed-date').should('contain', '2024-01-15');
      });
  });

  it.skipit('should allow downloading documents', () => {
    cy.visit(`/clients/client-001/documents`);

    cy.get('.btn-download').first().click();
  });

  it('should filter documents by category', () => {
    cy.get('#document-category-filter').select('contracts');
    cy.get('.document-item').each(($item) => {
      cy.wrap($item).find('.category-badge').should('contain', 'contracts');
    });
  });
});

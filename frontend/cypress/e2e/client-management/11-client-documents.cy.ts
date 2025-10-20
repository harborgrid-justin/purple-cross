/// <reference types="cypress" />

describe('Client Documents Management', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/documents`);
    });
  });

  it('should display client documents page', () => {
    cy.get('.page-header h1').should('contain', 'Client Documents');
    cy.get('.documents-section').should('be.visible');
  });

  it('should display client document list', () => {

    cy.wait('@getDocuments');
    cy.get('.document-item').should('have.length', 2);
  });

  it.skipit('should allow uploading new document', () => {
    cy.get('.btn-upload-document').click();
    cy.get('.upload-modal').should('be.visible');
    

    cy.get('#document-title').type('New Document');
    cy.get('#document-category').select('contracts');
    cy.get('#document-file').selectFile('cypress/fixtures/test-document.pdf', { force: true });
    cy.get('.btn-upload').click();
    
    cy.wait('@uploadDocument');
    cy.get('.success-message').should('contain', 'Document uploaded');
  });

  it('should display consent forms section', () => {
    cy.get('.consent-forms-section').should('be.visible');
    

    cy.wait('@getConsentForms');
    cy.get('.consent-form-item').should('have.length.at.least', 1);
  });

  it('should allow requesting client signature on document', () => {

    cy.visit(`/clients/client-001/documents`);
    

    cy.get('.btn-request-signature').first().click();
    cy.wait('@requestSignature');
    cy.get('.success-message').should('contain', 'Signature request sent');
  });

  it('should display signed documents with signature date', () => {

    cy.visit(`/clients/client-001/documents`);
    cy.get('.document-item').first().within(() => {
      cy.get('.signed-badge').should('be.visible');
      cy.get('.signed-date').should('contain', '2024-01-15');
    });
  });

  it.skipit('should allow downloading documents', () => {

    cy.visit(`/clients/client-001/documents`);
    

    cy.get('.btn-download').first().click();
    cy.wait('@downloadDocument');
  });

  it('should filter documents by category', () => {

    cy.get('#document-category-filter').select('contracts');
    cy.wait('@filterDocuments');
    
    cy.get('.document-item').each(($item) => {
      cy.wrap($item).find('.category-badge').should('contain', 'contracts');
    });
  });
});

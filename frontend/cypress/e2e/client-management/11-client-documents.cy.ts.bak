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
    cy.intercept('GET', '/api/clients/client-001/documents', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'doc-001', title: 'Service Agreement', category: 'contracts', uploadDate: '2024-01-15' },
          { id: 'doc-002', title: 'Payment Authorization', category: 'forms', uploadDate: '2024-01-10' },
        ],
      },
    }).as('getDocuments');

    cy.wait('@getDocuments');
    cy.get('.document-item').should('have.length', 2);
  });

  it('should allow uploading new document', () => {
    cy.get('.btn-upload-document').click();
    cy.get('.upload-modal').should('be.visible');
    
    cy.intercept('POST', '/api/clients/client-001/documents', {
      statusCode: 201,
      body: {
        status: 'success',
        data: { id: 'doc-003', title: 'New Document' },
      },
    }).as('uploadDocument');

    cy.get('#document-title').type('New Document');
    cy.get('#document-category').select('contracts');
    cy.get('#document-file').selectFile('cypress/fixtures/test-document.pdf', { force: true });
    cy.get('.btn-upload').click();
    
    cy.wait('@uploadDocument');
    cy.get('.success-message').should('contain', 'Document uploaded');
  });

  it('should display consent forms section', () => {
    cy.get('.consent-forms-section').should('be.visible');
    
    cy.intercept('GET', '/api/clients/client-001/documents?category=consent-forms', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'doc-004', title: 'Treatment Consent', category: 'consent-forms', signed: true },
        ],
      },
    }).as('getConsentForms');

    cy.wait('@getConsentForms');
    cy.get('.consent-form-item').should('have.length.at.least', 1);
  });

  it('should allow requesting client signature on document', () => {
    cy.intercept('GET', '/api/clients/client-001/documents', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'doc-001', title: 'Service Agreement', signed: false },
        ],
      },
    });

    cy.visit(`/clients/client-001/documents`);
    
    cy.intercept('POST', '/api/documents/doc-001/request-signature', {
      statusCode: 200,
      body: { status: 'success', message: 'Signature request sent' },
    }).as('requestSignature');

    cy.get('.btn-request-signature').first().click();
    cy.wait('@requestSignature');
    cy.get('.success-message').should('contain', 'Signature request sent');
  });

  it('should display signed documents with signature date', () => {
    cy.intercept('GET', '/api/clients/client-001/documents', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'doc-001', title: 'Service Agreement', signed: true, signedDate: '2024-01-15' },
        ],
      },
    });

    cy.visit(`/clients/client-001/documents`);
    cy.get('.document-item').first().within(() => {
      cy.get('.signed-badge').should('be.visible');
      cy.get('.signed-date').should('contain', '2024-01-15');
    });
  });

  it('should allow downloading documents', () => {
    cy.intercept('GET', '/api/clients/client-001/documents', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'doc-001', title: 'Service Agreement', url: '/documents/doc-001.pdf' },
        ],
      },
    });

    cy.visit(`/clients/client-001/documents`);
    
    cy.intercept('GET', '/api/documents/doc-001/download', {
      statusCode: 200,
      body: { status: 'success', url: 'https://example.com/document.pdf' },
    }).as('downloadDocument');

    cy.get('.btn-download').first().click();
    cy.wait('@downloadDocument');
  });

  it('should filter documents by category', () => {
    cy.intercept('GET', '/api/clients/client-001/documents*', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'doc-001', title: 'Contract', category: 'contracts' },
        ],
      },
    }).as('filterDocuments');

    cy.get('#document-category-filter').select('contracts');
    cy.wait('@filterDocuments');
    
    cy.get('.document-item').each(($item) => {
      cy.wrap($item).find('.category-badge').should('contain', 'contracts');
    });
  });
});

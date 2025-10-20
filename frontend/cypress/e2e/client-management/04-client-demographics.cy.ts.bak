/// <reference types="cypress" />

describe('Client Demographics Management', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/demographics`);
    });
  });

  it('should display client demographics page', () => {
    cy.get('.page-header h1').should('contain', 'Client Demographics');
    cy.get('.demographics-section').should('be.visible');
  });

  it('should display contact information section', () => {
    cy.get('.contact-info-section').should('be.visible');
    cy.get('.contact-info-section').should('contain', 'Contact Information');
    cy.get('.email-display').should('be.visible');
    cy.get('.phone-display').should('be.visible');
  });

  it('should display address information', () => {
    cy.get('.address-section').should('be.visible');
    cy.get('.address-section').should('contain', 'Address');
    cy.get('.street-address').should('contain', '123 Main St');
    cy.get('.city-state').should('contain', 'Springfield, IL');
    cy.get('.zip-code').should('contain', '62701');
  });

  it('should allow editing contact information', () => {
    cy.get('.btn-edit-contact').click();
    cy.get('#edit-email').should('be.visible');
    cy.get('#edit-phone').should('be.visible');
    
    cy.intercept('PUT', '/api/clients/client-001', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { id: 'client-001', email: 'newemail@example.com' },
      },
    }).as('updateClient');

    cy.get('#edit-email').clear().type('newemail@example.com');
    cy.get('.btn-save-contact').click();
    
    cy.wait('@updateClient');
    cy.get('.success-message').should('be.visible');
  });

  it('should allow editing address information', () => {
    cy.get('.btn-edit-address').click();
    cy.get('#edit-address').should('be.visible');
    cy.get('#edit-city').should('be.visible');
    cy.get('#edit-state').should('be.visible');
    cy.get('#edit-zipCode').should('be.visible');
    
    cy.intercept('PUT', '/api/clients/client-001', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { id: 'client-001', address: '456 New St' },
      },
    }).as('updateAddress');

    cy.get('#edit-address').clear().type('456 New St');
    cy.get('.btn-save-address').click();
    
    cy.wait('@updateAddress');
    cy.get('.success-message').should('be.visible');
  });
});

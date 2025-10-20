/// <reference types="cypress" />

describe('Client Relationships Management', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/relationships`);
    });
  });

  it('should display client relationships page', () => {
    cy.get('.page-header h1').should('contain', 'Client Relationships');
    cy.get('.relationships-section').should('be.visible');
  });

  it('should display patient ownership section', () => {
    cy.intercept('GET', '/api/clients/client-001/patients', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'pet-001', name: 'Buddy', species: 'Dog', breed: 'Golden Retriever' },
          { id: 'pet-002', name: 'Max', species: 'Cat', breed: 'Siamese' },
        ],
      },
    }).as('getPatients');

    cy.get('.patient-ownership-section').should('be.visible');
    cy.wait('@getPatients');
    cy.get('.patient-item').should('have.length', 2);
  });

  it('should allow adding a new pet to client', () => {
    cy.get('.btn-add-pet').click();
    cy.get('.add-pet-modal').should('be.visible');
    
    cy.intercept('POST', '/api/patients', {
      statusCode: 201,
      body: {
        status: 'success',
        data: { id: 'pet-003', name: 'Luna', ownerId: 'client-001' },
      },
    }).as('addPet');

    cy.get('#pet-name').type('Luna');
    cy.get('#pet-species').select('Dog');
    cy.get('.btn-save-pet').click();
    
    cy.wait('@addPet');
    cy.get('.success-message').should('contain', 'Pet added successfully');
  });

  it('should display family relationships', () => {
    cy.get('.family-relationships-section').should('be.visible');
    cy.get('.family-relationships-section').should('contain', 'Family Members');
  });

  it('should allow adding family member', () => {
    cy.get('.btn-add-family-member').click();
    cy.get('.add-family-modal').should('be.visible');
    cy.get('#family-member-name').should('be.visible');
    cy.get('#family-relationship').should('be.visible');
    
    cy.intercept('POST', '/api/clients/client-001/family-members', {
      statusCode: 201,
      body: {
        status: 'success',
        data: { id: 'family-001', name: 'Jane Smith', relationship: 'Spouse' },
      },
    }).as('addFamilyMember');

    cy.get('#family-member-name').type('Jane Smith');
    cy.get('#family-relationship').select('Spouse');
    cy.get('.btn-save-family').click();
    
    cy.wait('@addFamilyMember');
    cy.get('.success-message').should('contain', 'Family member added');
  });

  it('should display emergency contacts', () => {
    cy.intercept('GET', '/api/clients/client-001/emergency-contacts', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 1, name: 'Emergency Person', phone: '555-9999', relationship: 'Friend' },
        ],
      },
    }).as('getEmergencyContacts');

    cy.get('.emergency-contacts-section').should('be.visible');
    cy.wait('@getEmergencyContacts');
    cy.get('.emergency-contact-item').should('have.length', 1);
  });

  it('should display referral information', () => {
    cy.get('.referral-section').should('be.visible');
    cy.get('.referral-section').should('contain', 'Referral Information');
  });
});

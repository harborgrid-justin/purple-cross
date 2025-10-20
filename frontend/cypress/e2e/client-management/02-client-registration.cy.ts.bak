/// <reference types="cypress" />

describe('Client Registration', () => {
  beforeEach(() => {
    cy.visitClientsPage('registration');
  });

  it('should display the registration form', () => {
    cy.get('.registration-form').should('be.visible');
    cy.get('.page-header h1').should('contain', 'Register New Client');
  });

  it('should have all required form fields', () => {
    cy.get('#firstName').should('be.visible');
    cy.get('#lastName').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#phone').should('be.visible');
    cy.get('#address').should('be.visible');
    cy.get('#city').should('be.visible');
    cy.get('#state').should('be.visible');
    cy.get('#zipCode').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('.btn-submit').click();
    
    cy.get('#firstName').should('have.class', 'is-invalid');
    cy.get('#lastName').should('have.class', 'is-invalid');
    cy.get('#email').should('have.class', 'is-invalid');
    cy.get('.validation-error').should('be.visible');
  });

  it('should validate email format', () => {
    cy.get('#email').type('invalid-email');
    cy.get('#email').blur();
    
    cy.get('#email').should('have.class', 'is-invalid');
    cy.get('.validation-error').should('contain', 'valid email');
  });

  it('should validate phone number format', () => {
    cy.get('#phone').type('123');
    cy.get('#phone').blur();
    
    cy.get('#phone').should('have.class', 'is-invalid');
    cy.get('.validation-error').should('contain', 'phone');
  });

  it('should successfully register a new client with valid data', () => {
    cy.intercept('POST', '/api/clients', {
      statusCode: 201,
      body: {
        status: 'success',
        data: {
          id: 'client-new',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@email.com',
          phone: '555-0199',
          address: '100 New St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
        },
      },
    }).as('createClient');

    cy.get('#firstName').type('Jane');
    cy.get('#lastName').type('Doe');
    cy.get('#email').type('jane.doe@email.com');
    cy.get('#phone').type('555-0199');
    cy.get('#address').type('100 New St');
    cy.get('#city').type('Springfield');
    cy.get('#state').select('IL');
    cy.get('#zipCode').type('62701');
    cy.get('.btn-submit').click();

    cy.wait('@createClient');
    cy.get('.success-message').should('be.visible');
    cy.get('.success-message').should('contain', 'Client registered successfully');
  });

  it('should display error message on registration failure', () => {
    cy.intercept('POST', '/api/clients', {
      statusCode: 400,
      body: {
        status: 'error',
        message: 'Email already exists',
      },
    }).as('createClientError');

    cy.get('#firstName').type('Jane');
    cy.get('#lastName').type('Doe');
    cy.get('#email').type('existing@email.com');
    cy.get('#phone').type('555-0199');
    cy.get('#address').type('100 New St');
    cy.get('#city').type('Springfield');
    cy.get('#state').select('IL');
    cy.get('#zipCode').type('62701');
    cy.get('.btn-submit').click();

    cy.wait('@createClientError');
    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'Email already exists');
  });

  it('should clear form when reset button is clicked', () => {
    cy.get('#firstName').type('Jane');
    cy.get('#lastName').type('Doe');
    cy.get('#email').type('jane.doe@email.com');
    
    cy.get('.btn-reset').click();
    
    cy.get('#firstName').should('have.value', '');
    cy.get('#lastName').should('have.value', '');
    cy.get('#email').should('have.value', '');
  });

  it('should have optional emergency contact fields', () => {
    cy.get('#emergencyContactName').should('be.visible');
    cy.get('#emergencyContactPhone').should('be.visible');
    cy.get('#emergencyContactRelationship').should('be.visible');
  });

  it('should have optional preferences section', () => {
    cy.get('#communicationPreference').should('be.visible');
    cy.get('#preferredContactTime').should('be.visible');
  });

  it('should validate zipCode format', () => {
    cy.get('#zipCode').type('abc');
    cy.get('#zipCode').blur();
    
    cy.get('#zipCode').should('have.class', 'is-invalid');
    cy.get('.validation-error').should('be.visible');
  });

  it('should allow registration with minimal required fields only', () => {
    cy.intercept('POST', '/api/clients', {
      statusCode: 201,
      body: {
        status: 'success',
        data: {
          id: 'client-minimal',
          firstName: 'John',
          lastName: 'Minimal',
          email: 'john.minimal@email.com',
        },
      },
    }).as('createMinimalClient');

    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Minimal');
    cy.get('#email').type('john.minimal@email.com');
    cy.get('.btn-submit').click();

    cy.wait('@createMinimalClient');
    cy.get('.success-message').should('be.visible');
  });

  it('should validate name fields are not empty', () => {
    cy.get('#firstName').type('   ');
    cy.get('#firstName').blur();
    
    cy.get('#firstName').should('have.class', 'is-invalid');
    cy.get('.validation-error').should('be.visible');
  });

  it('should have accessible form labels', () => {
    cy.get('label[for="firstName"]').should('be.visible');
    cy.get('label[for="lastName"]').should('be.visible');
    cy.get('label[for="email"]').should('be.visible');
  });

  it('should show all US states in state dropdown', () => {
    cy.get('#state').find('option').should('have.length.at.least', 50);
  });

  it('should preserve form data when validation fails', () => {
    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');
    cy.get('.btn-submit').click();
    
    cy.get('#firstName').should('have.value', 'John');
    cy.get('#lastName').should('have.value', 'Doe');
  });
});

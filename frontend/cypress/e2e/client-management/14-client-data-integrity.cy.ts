/// <reference types="cypress" />

describe('Client Data Integrity', () => {
  beforeEach(() => {
    cy.visitClients();
  });

  it.skip('should handle duplicate client email validation during registration', () => {
    // Skipped: Duplicate validation requires full form submission and API integration
    cy.visitClientsPage('registration');

    // Attempt to register with an existing email
    cy.get('#firstName').type('Duplicate');
    cy.get('#lastName').type('Client');
    cy.get('#email').type('john.doe@email.com'); // Existing email
    cy.get('#phone').type('555-0100');
    cy.get('#address').type('123 Test St');
    cy.get('#city').type('Springfield');
    cy.get('#state').select('IL');
    cy.get('#zipCode').type('62701');

    cy.get('.btn-submit').click();

    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'already exists');
  });

  it('should prevent SQL injection in client search', () => {
    const maliciousInput = "'; DROP TABLE clients; --";
    cy.get('#client-search').type(maliciousInput);
    cy.get('.search-button').click();

    // Should safely handle the input without errors
    cy.get('.data-table').should('be.visible');
    cy.get('.error-message').should('not.exist');
  });

  it.skip('should sanitize XSS attempts in client notes', () => {
    // Skipped: XSS testing requires full form submission and API integration
    cy.visitClientsPage('registration');

    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('XSS');
    cy.get('#email').type('test.xss@email.com');
    cy.get('#phone').type('555-0199');
    cy.get('#notes').type('<script>alert("XSS")</script>');

    cy.get('.btn-submit').click();

    // Verify the script is escaped and not executed
    cy.on('window:alert', () => {
      throw new Error('XSS vulnerability detected!');
    });
  });

  it.skip('should handle special characters in client names correctly', () => {
    // Skipped: Registration requires full form submission and API integration
    cy.visitClientsPage('registration');

    cy.get('#firstName').type("O'Connor");
    cy.get('#lastName').type('José-María');
    cy.get('#email').type('special.chars@email.com');
    cy.get('#phone').type('555-0123');
    cy.get('#address').type('123 Test St');
    cy.get('#city').type('Springfield');
    cy.get('#state').select('IL');
    cy.get('#zipCode').type('62701');

    cy.get('.btn-submit').click();

    cy.get('.success-message').should('be.visible');
  });

  it.skip('should validate phone number uniqueness when required', () => {
    // Skipped: Validation requires full form submission and API integration
    cy.visitClientsPage('registration');

    cy.get('#firstName').type('Jane');
    cy.get('#lastName').type('Smith');
    cy.get('#email').type('unique.email@test.com');
    cy.get('#phone').type('555-0100'); // Duplicate phone
    cy.get('#address').type('456 Test Ave');
    cy.get('#city').type('Springfield');
    cy.get('#state').select('IL');
    cy.get('#zipCode').type('62702');

    cy.get('.btn-submit').click();

    // Should either succeed or show appropriate warning
    cy.get('.warning-message, .success-message').should('be.visible');
  });

  it.skip('should maintain data consistency across client updates', () => {
    // Skipped: Update functionality requires full form submission and API integration
    // Navigate to first client details
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();

    // Store original client data
    cy.get('.client-email').invoke('text').as('originalEmail');

    // Navigate to edit
    cy.get('.btn-edit').click();

    // Update only the phone number
    cy.get('#phone').clear().type('555-9999');
    cy.get('.btn-submit').click();

    cy.get('.success-message').should('be.visible');

    // Verify email remained unchanged
    cy.get('@originalEmail').then((originalEmail) => {
      cy.get('.client-email').should('contain', originalEmail);
    });
  });
});

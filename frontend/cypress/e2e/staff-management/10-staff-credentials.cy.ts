/// <reference types="cypress" />

describe('Staff Credentials Management', () => {
  beforeEach(() => {
    cy.visitStaff();
  });

  it('should display credentials section for staff member', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.credentials-section').should('be.visible');
  });

  it('should show professional licenses', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.licenses-list').should('be.visible');
    cy.get('.license-item').should('have.length.at.least', 1);
  });

  it('should display license details with expiration dates', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.license-item').first().within(() => {
      cy.get('.license-type').should('be.visible');
      cy.get('.license-number').should('be.visible');
      cy.get('.expiration-date').should('be.visible');
    });
  });

  it('should alert for expiring licenses', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.license-expiring-soon').should('have.class', 'alert-warning');
  });

  it('should allow adding new license', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.btn-add-license').click();
    cy.get('#license-type').select('Veterinary License');
    cy.get('#license-number').type('VET123456');
    cy.get('#issuing-state').select('CA');
    cy.get('#issue-date').type('2024-01-15');
    cy.get('#expiration-date').type('2025-01-15');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'License added');
  });

  it('should show certifications and training', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.certifications-section').should('be.visible');
    cy.get('.certification-item').should('have.length.at.least', 1);
  });

  it('should display continuing education credits', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.ce-credits').should('be.visible');
    cy.get('.total-credits').should('contain', 'hours');
  });

  it('should allow uploading credential documents', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.license-item').first().find('.btn-upload-doc').click();
    cy.get('.document-upload-form').should('be.visible');
  });

  it('should show DEA registration for authorized staff', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.dea-registration').should('be.visible');
  });

  it('should display credential verification status', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.verification-status').should('be.visible');
    cy.get('.verified-badge, .pending-badge').should('exist');
  });

  it('should send reminders for credential renewals', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.credentials-tab').click();
    cy.get('.renewal-reminder').should('be.visible');
  });
});

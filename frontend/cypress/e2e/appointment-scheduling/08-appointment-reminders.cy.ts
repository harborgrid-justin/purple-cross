/// <reference types="cypress" />

describe('Appointment Reminders', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it.skip('should display reminder settings for appointments', () => {
    // Skipped: Reminder feature UI not yet implemented
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.reminder-settings').should('be.visible');
  });

  it.skip('should allow enabling email reminders', () => {
    // Skipped: Reminder feature requires full implementation and API integration
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('#email-reminder').check();
    cy.get('.btn-save-settings').click();
    cy.get('.success-message').should('contain', 'Reminder settings saved');
  });

  it.skip('should allow enabling SMS reminders', () => {
    // Skipped: Reminder feature requires full implementation and API integration
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('#sms-reminder').check();
    cy.get('.btn-save-settings').click();
    cy.get('.success-message').should('be.visible');
  });

  it.skip('should show reminder schedule options', () => {
    // Skipped: Reminder feature UI not yet implemented
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('#reminder-timing').should('be.visible');
    cy.get('#reminder-timing option').should('have.length.at.least', 4);
  });

  it.skip('should display sent reminders history', () => {
    // Skipped: Reminder feature UI not yet implemented
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.sent-reminders').should('be.visible');
    cy.get('.reminder-item').should('have.length.at.least', 1);
  });

  it.skip('should show reminder delivery status', () => {
    // Skipped: Reminder feature UI not yet implemented
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.reminder-item')
      .first()
      .within(() => {
        cy.get('.delivery-status').should('exist');
      });
  });

  it.skip('should allow sending manual reminder', () => {
    // Skipped: Reminder feature requires full implementation and API integration
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.btn-send-reminder').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.btn-confirm-send').click();
    cy.get('.success-message').should('contain', 'Reminder sent');
  });

  it.skip('should display reminder templates', () => {
    // Skipped: Reminder template feature not yet implemented
    cy.visitAppointmentsPage('reminder-templates');
    cy.get('.template-list').should('be.visible');
    cy.get('.template-item').should('have.length.at.least', 3);
  });

  it.skip('should allow customizing reminder message', () => {
    // Skipped: Reminder feature requires full implementation and API integration
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.btn-customize-message').click();
    cy.get('#reminder-message').should('be.visible');
    cy.get('#reminder-message').clear().type('Custom reminder message');
    cy.get('.btn-save').click();
    cy.get('.success-message').should('be.visible');
  });

  it.skip('should show reminder preferences from client profile', () => {
    // Skipped: Reminder feature UI not yet implemented
    cy.get('.data-table tbody tr', { timeout: 10000 }).first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.client-preferences').should('be.visible');
  });
});

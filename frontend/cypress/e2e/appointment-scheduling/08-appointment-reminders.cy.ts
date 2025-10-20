/// <reference types="cypress" />

describe('Appointment Reminders', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it('should display reminder settings for appointments', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.reminder-settings').should('be.visible');
  });

  it('should allow enabling email reminders', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('#email-reminder').check();
    cy.get('.btn-save-settings').click();
    cy.get('.success-message').should('contain', 'Reminder settings saved');
  });

  it('should allow enabling SMS reminders', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('#sms-reminder').check();
    cy.get('.btn-save-settings').click();
    cy.get('.success-message').should('be.visible');
  });

  it('should show reminder schedule options', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('#reminder-timing').should('be.visible');
    cy.get('#reminder-timing option').should('have.length.at.least', 4);
  });

  it('should display sent reminders history', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.sent-reminders').should('be.visible');
    cy.get('.reminder-item').should('have.length.at.least', 1);
  });

  it('should show reminder delivery status', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.reminder-item').first().within(() => {
      cy.get('.delivery-status').should('exist');
    });
  });

  it('should allow sending manual reminder', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.btn-send-reminder').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.btn-confirm-send').click();
    cy.get('.success-message').should('contain', 'Reminder sent');
  });

  it('should display reminder templates', () => {
    cy.visitAppointmentsPage('reminder-templates');
    cy.get('.template-list').should('be.visible');
    cy.get('.template-item').should('have.length.at.least', 3);
  });

  it('should allow customizing reminder message', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.btn-customize-message').click();
    cy.get('#reminder-message').should('be.visible');
    cy.get('#reminder-message').clear().type('Custom reminder message');
    cy.get('.btn-save').click();
    cy.get('.success-message').should('be.visible');
  });

  it('should show reminder preferences from client profile', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.reminders-tab').click();
    cy.get('.client-preferences').should('be.visible');
  });
});

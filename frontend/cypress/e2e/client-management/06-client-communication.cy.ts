/// <reference types="cypress" />

describe('Client Communication', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/communications`);
    });
  });

  it('should display client communication page', () => {
    cy.get('.page-header h1').should('contain', 'Client Communications');
    cy.get('.communications-section').should('be.visible');
  });

  it('should display communication history', () => {

    cy.wait('@getCommunications');
    cy.get('.communication-item').should('have.length', 2);
  });

  it('should allow sending email to client', () => {
    cy.get('.btn-send-email').click();
    cy.get('.email-compose-modal').should('be.visible');
    cy.get('#email-subject').should('be.visible');
    cy.get('#email-body').should('be.visible');
    

    cy.get('#email-subject').type('Test Subject');
    cy.get('#email-body').type('Test message body');
    cy.get('.btn-send').click();
    
    cy.wait('@sendEmail');
    cy.get('.success-message').should('contain', 'Email sent');
  });

  it('should allow sending SMS to client', () => {
    cy.get('.btn-send-sms').click();
    cy.get('.sms-compose-modal').should('be.visible');
    cy.get('#sms-message').should('be.visible');
    

    cy.get('#sms-message').type('Test SMS message');
    cy.get('.btn-send').click();
    
    cy.wait('@sendSMS');
    cy.get('.success-message').should('contain', 'SMS sent');
  });

  it('should validate SMS message length', () => {
    cy.get('.btn-send-sms').click();
    const longMessage = 'a'.repeat(161);
    cy.get('#sms-message').type(longMessage);
    
    cy.get('.character-count').should('be.visible');
    cy.get('.validation-error').should('contain', 'exceeds maximum length');
  });

  it('should display email templates', () => {
    cy.get('.btn-send-email').click();
    cy.get('#template-select').should('be.visible');
    cy.get('#template-select option').should('have.length.at.least', 2);
  });

  it('should populate email from template', () => {

    cy.get('.btn-send-email').click();
    cy.get('#template-select').select('1');
    
    cy.wait('@getTemplate');
    cy.get('#email-subject').should('have.value', 'Appointment Reminder');
  });

  it('should filter communication history by type', () => {

    cy.get('#filter-type').select('email');
    cy.wait('@filterCommunications');
    
    cy.get('.communication-item').each(($item) => {
      cy.wrap($item).find('.type-badge').should('contain', 'email');
    });
  });

  it('should display communication delivery status', () => {

    cy.wait('@getCommunications');
    cy.get('.communication-item').first().within(() => {
      cy.get('.status-badge').should('be.visible');
      cy.get('.status-badge').should('contain', 'delivered');
    });
  });

  it('should display notification preferences', () => {
    cy.get('.notification-preferences').should('be.visible');
    cy.get('#email-notifications').should('be.visible');
    cy.get('#sms-notifications').should('be.visible');
  });

  it('should allow updating notification preferences', () => {

    cy.get('#email-notifications').check();
    cy.get('#sms-notifications').uncheck();
    cy.get('.btn-save-preferences').click();
    
    cy.wait('@updatePreferences');
    cy.get('.success-message').should('be.visible');
  });
});

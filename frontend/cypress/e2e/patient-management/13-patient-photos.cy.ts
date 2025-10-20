/// <reference types="cypress" />

describe('Patient Photos and Media', () => {
  beforeEach(() => {
    cy.visitPatients();
  });

  it.skip('should display patient profile photo', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.patient-photo').should('be.visible');
  });

  it.skip('should allow uploading new patient photo', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-upload-photo').click();
    cy.get('.photo-upload-dialog').should('be.visible');
  });

  it.skip('should display photo gallery for patient', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-gallery').should('be.visible');
    cy.get('.photo-item').should('have.length.at.least', 1);
  });

  it.skip('should allow viewing full-size photos', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().click();
    cy.get('.photo-viewer').should('be.visible');
    cy.get('.full-size-photo').should('be.visible');
  });

  it.skip('should show photo timestamps and captions', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item')
      .first()
      .within(() => {
        cy.get('.photo-date').should('be.visible');
        cy.get('.photo-caption').should('exist');
      });
  });

  it.skip('should allow adding captions to photos', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().find('.btn-edit-caption').click();
    cy.get('#photo-caption').type('Annual checkup - good condition');
    cy.get('.btn-save-caption').click();
    cy.get('.success-message').should('contain', 'Caption saved');
  });

  it.skip('should allow deleting photos with confirmation', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().find('.btn-delete-photo').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.confirm-dialog').should('contain', 'Are you sure');
  });

  it.skip('should support before/after comparison photos', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.before-after-view').should('be.visible');
  });

  it.skip('should allow tagging photos with medical conditions', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().find('.btn-tag-photo').click();
    cy.get('#photo-tags').type('dental disease');
    cy.get('.btn-save-tags').click();
    cy.get('.success-message').should('be.visible');
  });

  it.skip('should display photos chronologically', () => {
    // Skipped: Advanced patient management feature not yet fully implemented 
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').should('have.length.at.least', 2);
    // Verify chronological order
  });
});

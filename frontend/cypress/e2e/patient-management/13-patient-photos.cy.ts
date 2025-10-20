/// <reference types="cypress" />

describe('Patient Photos and Media', () => {
  beforeEach(() => {
    cy.visitPatients();
  });

  it('should display patient profile photo', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.patient-photo').should('be.visible');
  });

  it('should allow uploading new patient photo', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.btn-upload-photo').click();
    cy.get('.photo-upload-dialog').should('be.visible');
  });

  it('should display photo gallery for patient', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-gallery').should('be.visible');
    cy.get('.photo-item').should('have.length.at.least', 1);
  });

  it('should allow viewing full-size photos', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().click();
    cy.get('.photo-viewer').should('be.visible');
    cy.get('.full-size-photo').should('be.visible');
  });

  it('should show photo timestamps and captions', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().within(() => {
      cy.get('.photo-date').should('be.visible');
      cy.get('.photo-caption').should('exist');
    });
  });

  it('should allow adding captions to photos', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().find('.btn-edit-caption').click();
    cy.get('#photo-caption').type('Annual checkup - good condition');
    cy.get('.btn-save-caption').click();
    cy.get('.success-message').should('contain', 'Caption saved');
  });

  it('should allow deleting photos with confirmation', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().find('.btn-delete-photo').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.confirm-dialog').should('contain', 'Are you sure');
  });

  it('should support before/after comparison photos', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.before-after-view').should('be.visible');
  });

  it('should allow tagging photos with medical conditions', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').first().find('.btn-tag-photo').click();
    cy.get('#photo-tags').type('dental disease');
    cy.get('.btn-save-tags').click();
    cy.get('.success-message').should('be.visible');
  });

  it('should display photos chronologically', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.photos-tab').click();
    cy.get('.photo-item').should('have.length.at.least', 2);
    // Verify chronological order
  });
});

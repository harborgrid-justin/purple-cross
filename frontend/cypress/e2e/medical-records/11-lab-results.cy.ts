/// <reference types="cypress" />

describe('Medical Records - Lab Results', () => {
  beforeEach(() => {
    cy.visitMedicalRecords();
  });

  it('should display lab results section', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.lab-results-tab').click();
    cy.get('.lab-results-list').should('be.visible');
  });

  it('should show pending lab tests', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.lab-results-tab').click();
    cy.get('.pending-tests').should('be.visible');
    cy.get('.test-status.pending').should('have.length.at.least', 1);
  });

  it('should display completed lab results with values', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.lab-results-tab').click();
    cy.get('.completed-results').should('be.visible');
    cy.get('.lab-result-item').first().within(() => {
      cy.get('.test-name').should('be.visible');
      cy.get('.test-value').should('be.visible');
      cy.get('.test-date').should('be.visible');
    });
  });

  it('should highlight abnormal lab values', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.lab-results-tab').click();
    cy.get('.lab-result-item.abnormal').should('have.class', 'alert-warning');
    cy.get('.abnormal-indicator').should('be.visible');
  });

  it('should show reference ranges for lab tests', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.lab-results-tab').click();
    cy.get('.lab-result-item').first().within(() => {
      cy.get('.reference-range').should('be.visible');
      cy.get('.reference-range').should('contain', '-');
    });
  });

  it('should allow ordering new lab tests', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.lab-results-tab').click();
    cy.get('.btn-order-lab-test').click();
    cy.get('.lab-test-form').should('be.visible');
    cy.get('#test-type').select('Complete Blood Count');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Lab test ordered');
  });

  it('should display graphical trends for repeated tests', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.lab-results-tab').click();
    cy.get('.trends-view-toggle').click();
    cy.get('.lab-trends-chart').should('be.visible');
  });

  it('should allow downloading lab reports', () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.lab-results-tab').click();
    cy.get('.lab-result-item').first().find('.btn-download-report').should('be.visible');
  });
});

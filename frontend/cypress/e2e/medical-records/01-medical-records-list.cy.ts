/// <reference types="cypress" />

describe('Medical Records List View', () => {
  it('should display the medical records page title', () => {
    cy.visitMedicalRecords();
    cy.get('.page-header h1').should('contain', 'Medical Records');
  });

  it('should display the "Add Record" button', () => {
    cy.visitMedicalRecords();
    cy.get('.btn-primary').should('contain', 'Add Record');
    cy.get('.btn-primary').should('be.visible');
  });

  it('should display medical records table with correct headers', () => {
    cy.visitMedicalRecords();
    cy.get('.data-table', { timeout: 10000 }).should('be.visible');
    cy.get('.data-table thead th').should('have.length', 5);
    cy.get('.data-table thead th').eq(0).should('contain', 'Date');
    cy.get('.data-table thead th').eq(1).should('contain', 'Patient');
    cy.get('.data-table thead th').eq(2).should('contain', 'Type');
    cy.get('.data-table thead th').eq(3).should('contain', 'Veterinarian');
    cy.get('.data-table thead th').eq(4).should('contain', 'Actions');
  });

  it('should display medical record data in the table', () => {
    cy.visitMedicalRecords();
    cy.get('.data-table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('.data-table tbody tr')
      .first()
      .within(() => {
        cy.get('th').should('exist');
        cy.get('td').should('have.length.at.least', 3);
      });
  });

  it('should display action buttons for each record', () => {
    cy.visitMedicalRecords();
    cy.get('.data-table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.btn-action').should('have.length', 2);
        cy.get('.btn-action').eq(0).should('contain', 'View');
        cy.get('.btn-action').eq(1).should('contain', 'Edit');
      });
  });

  it('should navigate to medical records subpages via navigation', () => {
    cy.visitMedicalRecords();

    cy.get('.sub-nav-link').should('have.length.at.least', 9);
    cy.contains('.sub-nav-link', 'All Records').should('have.class', 'active');

    cy.contains('.sub-nav-link', 'EMR').click();
    cy.url().should('include', '/medical-records/emr');
  });

  it('should display proper ARIA labels for accessibility', () => {
    cy.visitMedicalRecords();
    cy.get('.data-table', { timeout: 10000 }).should('exist');
    cy.get('.data-table').should('have.attr', 'role', 'table');
    cy.get('.data-table').should('have.attr', 'aria-label');
    cy.get('.btn-primary').should('have.attr', 'aria-label');
  });

  it('should have proper page structure', () => {
    cy.visitMedicalRecords();

    cy.get('.page').should('exist');
    cy.get('.page-header').should('exist');
    cy.get('.sub-nav').should('exist');
  });

  it('should display navigation with correct sections', () => {
    cy.visitMedicalRecords();

    const expectedSections = [
      'All Records',
      'EMR',
      'Clinical Notes',
      'Diagnostics',
      'Treatment History',
      'Vital Signs',
      'Attachments',
      'Record Sharing',
      'Audit Trail',
    ];

    expectedSections.forEach((section) => {
      cy.contains('.sub-nav-link', section).should('exist');
    });
  });

  it.skip('should display loading state', () => {
    cy.visitMedicalRecords();
    cy.contains('Loading').should('be.visible');
  });

  it('should highlight active navigation link', () => {
    cy.visitMedicalRecords();
    cy.contains('.sub-nav-link', 'All Records').should('have.class', 'active');
  });

  it('should have accessible action buttons with labels', () => {
    cy.visitMedicalRecords();
    cy.get('.data-table tbody tr', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.btn-action').each(($btn) => {
          cy.wrap($btn).should('have.attr', 'aria-label');
        });
      });
  });

  it('should have navigation with proper ARIA labels', () => {
    cy.visitMedicalRecords();
    cy.get('.sub-nav').should('have.attr', 'role', 'navigation');
    cy.get('.sub-nav').should('have.attr', 'aria-label');
  });

  it('should display all navigation links', () => {
    cy.visitMedicalRecords();
    cy.get('.sub-nav-link').should('have.length.at.least', 9);
  });

  it('should maintain table structure integrity', () => {
    cy.visitMedicalRecords();
    cy.get('.table-container', { timeout: 10000 }).should('exist');
    cy.get('.data-table thead').should('exist');
    cy.get('.data-table tbody').should('exist');
  });
});

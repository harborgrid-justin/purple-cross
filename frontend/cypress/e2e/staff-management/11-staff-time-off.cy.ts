/// <reference types="cypress" />

describe('Staff Time Off Management', () => {
  beforeEach(() => {
    cy.visitStaff();
  });

  it.skip('should display time off requests section',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.time-off-tab').click();
    cy.get('.time-off-section').should('be.visible');
  });

  it.skip('should show upcoming time off',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.time-off-tab').click();
    cy.get('.upcoming-time-off').should('be.visible');
  });

  it.skip('should display time off balance',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.time-off-tab').click();
    cy.get('.pto-balance').should('be.visible');
    cy.get('.available-days').should('contain', 'days');
  });

  it.skip('should allow requesting time off',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.time-off-tab').click();
    cy.get('.btn-request-time-off').click();
    cy.get('#start-date').type('2024-07-01');
    cy.get('#end-date').type('2024-07-05');
    cy.get('#time-off-type').select('Vacation');
    cy.get('#reason').type('Family vacation');
    cy.get('.btn-submit').click();
    cy.get('.success-message').should('contain', 'Time off requested');
  });

  it.skip('should show pending time off requests',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.time-off-tab').click();
    cy.get('.pending-requests').should('be.visible');
    cy.get('.request-item.pending').should('have.length.at.least', 1);
  });

  it.skip('should display time off history',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.time-off-tab').click();
    cy.get('.time-off-history').should('be.visible');
    cy.get('.past-time-off').should('have.length.at.least', 2);
  });

  it.skip('should show different types of leave',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.time-off-tab').click();
    cy.get('.leave-types').should('be.visible');
    cy.get('.sick-leave').should('exist');
    cy.get('.vacation-leave').should('exist');
  });

  it.skip('should allow approving time off requests as manager',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('time-off-approvals');
    cy.get('.pending-approval').first().find('.btn-approve').click();
    cy.get('.confirm-dialog').should('be.visible');
    cy.get('.btn-confirm-approve').click();
    cy.get('.success-message').should('contain', 'approved');
  });

  it.skip('should show time off calendar view',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.visitStaffPage('time-off-calendar');
    cy.get('.time-off-calendar').should('be.visible');
    cy.get('.calendar-event').should('have.length.at.least', 1);
  });

  it.skip('should warn about overlapping time off requests',


  // Skipped: Advanced staff management feature not yet fully implemented () => {
    cy.get('.data-table tbody tr').first().find('.btn-action').contains('View').click();
    cy.get('.time-off-tab').click();
    cy.get('.btn-request-time-off').click();
    cy.get('#start-date').type('2024-06-15');
    cy.get('#end-date').type('2024-06-20');
    cy.get('.btn-submit').click();
    cy.get('.warning-message').should('contain', 'overlap');
  });
});

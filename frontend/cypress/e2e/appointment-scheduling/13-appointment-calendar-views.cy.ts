/// <reference types="cypress" />

describe('Appointment Calendar Views', () => {
  beforeEach(() => {
    cy.visitAppointments();
  });

  it('should display calendar view toggle', () => {
    cy.get('.view-selector').should('be.visible');
    cy.get('.view-option').should('have.length.at.least', 3);
  });

  it('should switch to day view', () => {
    cy.get('.view-option[data-view="day"]').click();
    cy.get('.calendar-day-view').should('be.visible');
  });

  it('should switch to week view', () => {
    cy.get('.view-option[data-view="week"]').click();
    cy.get('.calendar-week-view').should('be.visible');
    cy.get('.day-column').should('have.length', 7);
  });

  it('should switch to month view', () => {
    cy.get('.view-option[data-view="month"]').click();
    cy.get('.calendar-month-view').should('be.visible');
  });

  it('should display appointments in calendar grid', () => {
    cy.get('.view-option[data-view="week"]').click();
    cy.get('.appointment-block').should('have.length.at.least', 3);
  });

  it('should show appointment details on hover', () => {
    cy.get('.view-option[data-view="week"]').click();
    cy.get('.appointment-block').first().trigger('mouseover');
    cy.get('.appointment-tooltip').should('be.visible');
  });

  it('should allow navigating to previous period', () => {
    cy.get('.btn-prev-period').click();
    cy.get('.calendar-header').should('be.visible');
  });

  it('should allow navigating to next period', () => {
    cy.get('.btn-next-period').click();
    cy.get('.calendar-header').should('be.visible');
  });

  it('should display today button', () => {
    cy.get('.btn-today').should('be.visible');
    cy.get('.btn-today').click();
    cy.get('.current-date-indicator').should('be.visible');
  });

  it('should highlight current time in day view', () => {
    cy.get('.view-option[data-view="day"]').click();
    cy.get('.current-time-indicator').should('be.visible');
  });

  it('should show time slots in correct intervals', () => {
    cy.get('.view-option[data-view="day"]').click();
    cy.get('.time-slot').should('have.length.at.least', 16); // 8 hours * 2 (30-min slots)
  });

  it('should allow drag-and-drop appointment rescheduling', () => {
    cy.get('.view-option[data-view="week"]').click();
    cy.get('.appointment-block')
      .first()
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 100, clientY: 200 })
      .trigger('mouseup');
  });
});

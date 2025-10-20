/// <reference types="cypress" />

describe('Client Appointment History', () => {
  beforeEach(() => {
    cy.fixture('clients').then((clients) => {
      cy.mockClient(clients[0]);
      cy.visit(`/clients/${clients[0].id}/appointments`);
    });
  });

  it('should display client appointments page', () => {
    cy.get('.page-header h1').should('contain', 'Client Appointments');
    cy.get('.appointments-section').should('be.visible');
  });

  it('should display appointment history', () => {
    cy.intercept('GET', '/api/clients/client-001/appointments', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'apt-001', patientName: 'Buddy', startTime: '2024-01-15T10:00:00Z', status: 'completed' },
          { id: 'apt-002', patientName: 'Max', startTime: '2024-01-20T14:00:00Z', status: 'scheduled' },
        ],
      },
    }).as('getAppointments');

    cy.wait('@getAppointments');
    cy.get('.appointment-item').should('have.length', 2);
  });

  it('should display upcoming appointments', () => {
    cy.intercept('GET', '/api/clients/client-001/appointments?status=scheduled', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'apt-002', patientName: 'Max', startTime: '2024-12-20T14:00:00Z', status: 'scheduled' },
        ],
      },
    }).as('getUpcoming');

    cy.get('#appointment-filter').select('upcoming');
    cy.wait('@getUpcoming');
    cy.get('.appointment-item').should('have.length.at.least', 1);
  });

  it('should display past appointments', () => {
    cy.intercept('GET', '/api/clients/client-001/appointments?status=completed', {
      statusCode: 200,
      body: {
        status: 'success',
        data: [
          { id: 'apt-001', patientName: 'Buddy', startTime: '2024-01-15T10:00:00Z', status: 'completed' },
        ],
      },
    }).as('getPast');

    cy.get('#appointment-filter').select('past');
    cy.wait('@getPast');
    cy.get('.appointment-item').should('have.length.at.least', 1);
  });

  it('should allow booking new appointment from client page', () => {
    cy.get('.btn-book-appointment').click();
    cy.get('.appointment-booking-modal').should('be.visible');
    cy.get('#select-patient').should('be.visible');
    cy.get('#select-date').should('be.visible');
    cy.get('#select-time').should('be.visible');
  });

  it('should display appointment statistics', () => {
    cy.intercept('GET', '/api/clients/client-001/appointments/statistics', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          totalAppointments: 25,
          completedAppointments: 20,
          cancelledAppointments: 3,
          noShowAppointments: 2,
        },
      },
    }).as('getStatistics');

    cy.get('.appointment-statistics').should('be.visible');
    cy.wait('@getStatistics');
    cy.get('.total-appointments').should('contain', '25');
  });

  it('should display scheduling preferences', () => {
    cy.get('.scheduling-preferences-section').should('be.visible');
    cy.get('.preferred-day').should('be.visible');
    cy.get('.preferred-time').should('be.visible');
  });

  it('should allow updating scheduling preferences', () => {
    cy.get('.btn-edit-preferences').click();
    
    cy.intercept('PUT', '/api/clients/client-001/scheduling-preferences', {
      statusCode: 200,
      body: { status: 'success' },
    }).as('updatePreferences');

    cy.get('#preferred-day').select('Monday');
    cy.get('#preferred-time').select('Morning');
    cy.get('#reminder-preference').check();
    cy.get('.btn-save-preferences').click();
    
    cy.wait('@updatePreferences');
    cy.get('.success-message').should('contain', 'Preferences updated');
  });
});

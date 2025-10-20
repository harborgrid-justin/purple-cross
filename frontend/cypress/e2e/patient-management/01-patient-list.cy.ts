/// <reference types="cypress" />

describe('Patient List View', () => {
  let patients: unknown[];

  beforeEach(() => {
    // Load fixture data
    cy.fixture('patients').then((data) => {
      patients = data;
      cy.mockPatients(data);
    });
  });

  it('should display the patients page title', () => {
    cy.visitPatients();
    cy.get('.page-header h1').should('contain', 'Patients');
  });

  it('should display the "Add New Patient" button', () => {
    cy.visitPatients();
    cy.get('.btn-primary').should('contain', 'Add New Patient');
    cy.get('.btn-primary').should('be.visible');
  });

  it('should display patient list table with correct headers', () => {
    cy.visitPatients();
    cy.wait('@getPatientsData');
    
    cy.get('.data-table').should('be.visible');
    cy.get('.data-table thead th').should('have.length', 6);
    cy.get('.data-table thead th').eq(0).should('contain', 'Name');
    cy.get('.data-table thead th').eq(1).should('contain', 'Species');
    cy.get('.data-table thead th').eq(2).should('contain', 'Breed');
    cy.get('.data-table thead th').eq(3).should('contain', 'Owner');
    cy.get('.data-table thead th').eq(4).should('contain', 'Last Updated');
    cy.get('.data-table thead th').eq(5).should('contain', 'Actions');
  });

  it('should display patient data in the table', () => {
    cy.visitPatients();
    cy.wait('@getPatientsData');
    
    // Check that we have patient rows
    cy.get('.data-table tbody tr').should('have.length', 6);
    
    // Check first patient data
    cy.get('.data-table tbody tr').first().within(() => {
      cy.get('th').should('contain', 'Buddy');
      cy.get('td').eq(0).should('contain', 'Dog');
      cy.get('td').eq(1).should('contain', 'Golden Retriever');
      cy.get('td').eq(2).should('contain', 'John Smith');
    });
  });

  it('should display action buttons for each patient', () => {
    cy.visitPatients();
    cy.wait('@getPatientsData');
    
    cy.get('.data-table tbody tr').first().within(() => {
      cy.get('.btn-action').should('have.length', 2);
      cy.get('.btn-action').eq(0).should('contain', 'View');
      cy.get('.btn-action').eq(1).should('contain', 'Edit');
    });
  });

  it('should display search input field', () => {
    cy.visitPatients();
    
    cy.get('#patient-search').should('be.visible');
    cy.get('#patient-search').should('have.attr', 'placeholder')
      .and('include', 'Search patients');
  });

  it('should filter patients when searching', () => {
    cy.visitPatients();
    cy.wait('@getPatientsData');
    
    // Mock filtered results
    const filteredPatients = patients.filter((p: { name: string }) => 
      p.name.toLowerCase().includes('buddy')
    );
    cy.mockPatients(filteredPatients);
    
    cy.searchPatients('Buddy');
    cy.wait('@getPatientsData');
    
    cy.get('.data-table tbody tr').should('have.length', 1);
    cy.get('.data-table tbody tr').first().should('contain', 'Buddy');
  });

  it('should display "No patients found" message when list is empty', () => {
    cy.mockPatients([]);
    cy.visitPatients();
    cy.wait('@getPatientsData');
    
    cy.contains('No patients found').should('be.visible');
  });

  it('should display loading state', () => {
    cy.intercept('GET', '/api/patients*', {
      delay: 1000,
      statusCode: 200,
      body: { status: 'success', data: patients },
    }).as('slowPatients');
    
    cy.visitPatients();
    cy.contains('Loading patients...').should('be.visible');
  });

  it('should navigate to patient subpages via navigation', () => {
    cy.visitPatients();
    
    cy.get('.sub-nav-link').should('have.length.at.least', 8);
    cy.contains('.sub-nav-link', 'All Patients').should('have.class', 'active');
    
    cy.contains('.sub-nav-link', 'Registration & Profiles').click();
    cy.url().should('include', '/patients/registration');
  });

  it('should display proper ARIA labels for accessibility', () => {
    cy.visitPatients();
    cy.wait('@getPatientsData');
    
    cy.get('[role="search"]').should('exist');
    cy.get('[role="table"]').should('exist');
    cy.get('#patient-search').should('have.attr', 'aria-label');
    cy.get('.btn-primary').should('have.attr', 'aria-label');
  });

  it('should format dates correctly in the table', () => {
    cy.visitPatients();
    cy.wait('@getPatientsData');
    
    cy.get('.data-table tbody tr').first().within(() => {
      cy.get('time').should('exist');
      cy.get('time').should('have.attr', 'dateTime');
    });
  });
});

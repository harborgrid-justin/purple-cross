/**
 * WF-COMP-XXX | Search.tsx - Search
 * Purpose: React component for Search functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface PatientRow {
  id: string;
  name: string;
  species: string;
  breed?: string;
  microchipId?: string;
  owner?: { firstName: string; lastName: string };
}

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');

  const { data, isLoading, isError } = usePatients({
    search: searchTerm || undefined,
    limit: 50,
  });

  const allPatients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];
  const patients = speciesFilter
    ? allPatients.filter((p) => p.species === speciesFilter)
    : allPatients;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Search &amp; Filtering</h1>
        <p className="page-subtitle">Quickly locate patient records by name, microchip, or owner</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="patient-search" className="sr-only">
          Search patients
        </label>
        <input
          id="patient-search"
          type="search"
          placeholder="Search by name, microchip, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search patients by name, microchip, or owner"
        />
        <label htmlFor="species-filter" className="sr-only">
          Filter by species
        </label>
        <select
          id="species-filter"
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          aria-label="Filter by species"
        >
          <option value="">All Species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Searching patients...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to search patients. Please try again.</p>
          </div>
        ) : patients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No patients match your search.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Patient search results">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Species</th>
                <th scope="col">Breed</th>
                <th scope="col">Microchip ID</th>
                <th scope="col">Owner</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <th scope="row">{patient.name}</th>
                  <td>{patient.species}</td>
                  <td>{patient.breed || 'N/A'}</td>
                  <td>{patient.microchipId || 'N/A'}</td>
                  <td>
                    {patient.owner
                      ? `${patient.owner.firstName} ${patient.owner.lastName}`
                      : 'Unknown'}
                  </td>
                  <td>
                    <Link
                      to={`/patients/${patient.id}`}
                      className="btn-action"
                      aria-label={`View details for ${patient.name}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientSearch;

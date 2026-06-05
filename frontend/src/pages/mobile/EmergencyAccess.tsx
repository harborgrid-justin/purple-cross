/**
 * WF-COMP-XXX | EmergencyAccess.tsx - Emergency Access
 * Purpose: React component for EmergencyAccess functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface PatientRow {
  id: string;
  name: string;
  species?: string;
  breed?: string;
  owner?: { firstName: string; lastName: string; phone?: string };
}

const EmergencyAccess = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = usePatients({
    search: searchTerm || undefined,
    limit: 25,
  });

  const patients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Emergency Access</h1>
      </header>
      <p className="page-subtitle">
        Rapid patient lookup for emergency and after-hours situations.
      </p>

      <div className="search-bar" role="search">
        <label htmlFor="emergency-search" className="sr-only">
          Search patients
        </label>
        <input
          id="emergency-search"
          type="search"
          placeholder="Search patient by name or microchip ID…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search patients for emergency access"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Searching patients…</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to look up patients. Please try again.</p>
          </div>
        ) : patients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No matching patients found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Emergency patient lookup results">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Species</th>
                <th scope="col">Owner</th>
                <th scope="col">Contact</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <th scope="row">{patient.name}</th>
                  <td>{patient.species ?? 'N/A'}</td>
                  <td>
                    {patient.owner
                      ? `${patient.owner.firstName} ${patient.owner.lastName}`
                      : 'Unknown'}
                  </td>
                  <td>{patient.owner?.phone ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmergencyAccess;

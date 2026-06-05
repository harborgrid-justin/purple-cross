/**
 * WF-COMP-XXX | Demographics.tsx - Demographics
 * Purpose: React component for Demographics functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useMemo } from 'react';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface PatientRow {
  id: string;
  name: string;
  species: string;
  breed?: string;
  gender?: string;
  dateOfBirth?: string;
}

const calcAge = (dob?: string): string => {
  if (!dob) return 'Unknown';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 'Unknown';
  const years = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return years <= 0 ? '<1 yr' : `${years} yr${years === 1 ? '' : 's'}`;
};

const PatientDemographics = () => {
  const { data, isLoading, isError } = usePatients({ limit: 100 });
  const patients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];

  const speciesBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of patients) {
      counts.set(p.species, (counts.get(p.species) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [patients]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Demographics</h1>
        <p className="page-subtitle">Population breakdown by species, breed, gender, and age</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading demographics...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load demographics. Please try again.</p>
          </div>
        ) : patients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No patient data available.</p>
          </div>
        ) : (
          <>
            <table className="data-table" role="table" aria-label="Species breakdown">
              <thead>
                <tr>
                  <th scope="col">Species</th>
                  <th scope="col">Count</th>
                  <th scope="col">Share</th>
                </tr>
              </thead>
              <tbody>
                {speciesBreakdown.map(([species, count]) => (
                  <tr key={species}>
                    <th scope="row">{species}</th>
                    <td>{count}</td>
                    <td>{Math.round((count / patients.length) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table
              className="data-table"
              role="table"
              aria-label="Patient demographics"
              style={{ marginTop: '2rem' }}
            >
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Species</th>
                  <th scope="col">Breed</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Age</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <th scope="row">{patient.name}</th>
                    <td>{patient.species}</td>
                    <td>{patient.breed || 'N/A'}</td>
                    <td>{patient.gender || 'Unknown'}</td>
                    <td>{calcAge(patient.dateOfBirth)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientDemographics;

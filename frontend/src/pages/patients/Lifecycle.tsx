/**
 * WF-COMP-XXX | Lifecycle.tsx - Lifecycle
 * Purpose: React component for Lifecycle functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface PatientRow {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
}

type LifeStage = 'Pediatric' | 'Adult' | 'Senior' | 'Unknown';

const ageInYears = (dob?: string): number | null => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  return (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
};

const lifeStage = (dob?: string): LifeStage => {
  const years = ageInYears(dob);
  if (years === null) return 'Unknown';
  if (years < 1) return 'Pediatric';
  if (years < 7) return 'Adult';
  return 'Senior';
};

const STAGES: LifeStage[] = ['Pediatric', 'Adult', 'Senior', 'Unknown'];

const PatientLifecycle = () => {
  const [stageFilter, setStageFilter] = useState<string>('');
  const { data, isLoading, isError } = usePatients({ limit: 100 });

  const allPatients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];

  const withStage = useMemo(
    () => allPatients.map((p) => ({ ...p, stage: lifeStage(p.dateOfBirth) })),
    [allPatients]
  );

  const patients = stageFilter ? withStage.filter((p) => p.stage === stageFilter) : withStage;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Lifecycle Management</h1>
        <p className="page-subtitle">Track patients across pediatric, adult, and senior stages</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="stage-filter" className="sr-only">
          Filter by life stage
        </label>
        <select
          id="stage-filter"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          aria-label="Filter by life stage"
        >
          <option value="">All Life Stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading lifecycle data...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load lifecycle data. Please try again.</p>
          </div>
        ) : patients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No patients match the selected life stage.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Patient lifecycle">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Species</th>
                <th scope="col">Breed</th>
                <th scope="col">Life Stage</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <th scope="row">{patient.name}</th>
                  <td>{patient.species}</td>
                  <td>{patient.breed || 'N/A'}</td>
                  <td>{patient.stage}</td>
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

export default PatientLifecycle;

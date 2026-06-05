/**
 * WF-COMP-XXX | HealthStatus.tsx - Health Status
 * Purpose: React component for HealthStatus functionality
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
  status?: string;
  updatedAt?: string;
}

const HEALTH_STATUSES = ['active', 'inactive', 'deceased'];

const PatientHealthStatus = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, isError } = usePatients({ limit: 100 });

  const allPatients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];
  const patients = statusFilter
    ? allPatients.filter((p) => (p.status ?? 'active') === statusFilter)
    : allPatients;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Health Status Monitoring</h1>
        <p className="page-subtitle">Track current status across the patient population</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="status-filter" className="sr-only">
          Filter by health status
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by health status"
        >
          <option value="">All Statuses</option>
          {HEALTH_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading health status...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load patient health status. Please try again.</p>
          </div>
        ) : patients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No patients match the selected status.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Patient health status">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Species</th>
                <th scope="col">Breed</th>
                <th scope="col">Status</th>
                <th scope="col">Last Updated</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => {
                const status = patient.status ?? 'active';
                return (
                  <tr key={patient.id}>
                    <th scope="row">{patient.name}</th>
                    <td>{patient.species}</td>
                    <td>{patient.breed || 'N/A'}</td>
                    <td>
                      <span
                        className={`status-badge status-${status}`}
                        role="status"
                        aria-label={`Status: ${status}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      {patient.updatedAt ? (
                        <time dateTime={patient.updatedAt}>
                          {new Date(patient.updatedAt).toLocaleDateString()}
                        </time>
                      ) : (
                        'N/A'
                      )}
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientHealthStatus;

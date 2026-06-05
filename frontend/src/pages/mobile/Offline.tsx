/**
 * WF-COMP-XXX | Offline.tsx - Offline
 * Purpose: React component for Offline functionality
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
}

const Offline = () => {
  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = usePatients({
    limit: 50,
  });
  const [offlineMode, setOfflineMode] = useState(false);

  const patients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Offline Capabilities</h1>
        <button
          className="btn-secondary"
          onClick={() => void refetch()}
          disabled={isFetching || offlineMode}
          aria-label="Refresh offline cache"
        >
          {isFetching ? 'Caching…' : 'Update Cache'}
        </button>
      </header>
      <p className="page-subtitle">Records cached locally remain available without a connection.</p>

      <div className="form-group">
        <label htmlFor="offline-toggle">
          <input
            id="offline-toggle"
            type="checkbox"
            checked={offlineMode}
            onChange={(e) => setOfflineMode(e.target.checked)}
          />{' '}
          Simulate offline mode
        </label>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            {offlineMode ? '✈️' : '📶'}
          </span>
          <div className="stat-content">
            <div className="stat-label">Mode</div>
            <div className="stat-value">{offlineMode ? 'Offline' : 'Online'}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            💾
          </span>
          <div className="stat-content">
            <div className="stat-label">Cached Records</div>
            <div className="stat-value">{patients.length.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            🕒
          </span>
          <div className="stat-content">
            <div className="stat-label">Cache Updated</div>
            <div className="stat-value">
              {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <h2>Cached Patient Records</h2>
      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Building offline cache…</p>
          </div>
        ) : isError && !offlineMode ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to update cache. Cached records (if any) are shown below.</p>
          </div>
        ) : patients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No records cached yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Cached patient records">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Species</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <th scope="row">{patient.name}</th>
                  <td>{patient.species ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Offline;

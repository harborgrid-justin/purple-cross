/**
 * WF-COMP-XXX | Sync.tsx - Sync
 * Purpose: React component for Sync functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface SyncEntry {
  id: string;
  timestamp: string;
  records: number;
  result: 'success' | 'failed';
}

interface PatientRow {
  id: string;
}

const Sync = () => {
  const { data, isError, refetch, isFetching, dataUpdatedAt } = usePatients({ limit: 100 });
  const [history, setHistory] = useState<SyncEntry[]>([]);

  const patients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];

  const handleSync = async (): Promise<void> => {
    const result = await refetch();
    const succeeded = !result.isError;
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        records: succeeded ? patients.length : 0,
        result: succeeded ? 'success' : 'failed',
      },
      ...prev,
    ]);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Cross-Platform Sync</h1>
        <button
          className="btn-primary"
          onClick={() => void handleSync()}
          disabled={isFetching}
          aria-label="Sync now"
        >
          {isFetching ? 'Syncing…' : 'Sync Now'}
        </button>
      </header>
      <p className="page-subtitle">Synchronize local device data with the server.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            {isError ? '🔴' : '🟢'}
          </span>
          <div className="stat-content">
            <div className="stat-label">Connection</div>
            <div className="stat-value">{isError ? 'Offline' : 'Online'}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            📦
          </span>
          <div className="stat-content">
            <div className="stat-label">Records Available</div>
            <div className="stat-value">{patients.length.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            🕒
          </span>
          <div className="stat-content">
            <div className="stat-label">Last Server Update</div>
            <div className="stat-value">
              {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <h2>Sync History</h2>
      <div className="table-container">
        {history.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No sync operations performed yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Sync history">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Records</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <th scope="row">
                    <time dateTime={entry.timestamp}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </time>
                  </th>
                  <td>{entry.records.toLocaleString()}</td>
                  <td>
                    <span
                      className={`status-badge status-${entry.result === 'success' ? 'confirmed' : 'cancelled'}`}
                      role="status"
                    >
                      {entry.result === 'success' ? 'Success' : 'Failed'}
                    </span>
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

export default Sync;

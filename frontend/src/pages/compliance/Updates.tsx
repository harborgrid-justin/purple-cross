/**
 * WF-COMP-XXX | Updates.tsx - Updates
 * Purpose: React component for Updates functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePolicies, useAcknowledgePolicy } from '../../hooks/usePolicies';
import '../../styles/Page.css';

const CATEGORY = 'regulatory-update';

interface PolicyRow {
  id: string;
  title: string;
  category: string;
  version?: string;
  status?: string;
  effectiveDate?: string;
}

const Updates: React.FC = () => {
  const [userId, setUserId] = useState('');
  const { data, isLoading, isError } = usePolicies({ limit: 50 });
  const acknowledgeMutation = useAcknowledgePolicy();

  const rows = useMemo<PolicyRow[]>(
    () => (data as { data?: PolicyRow[] } | undefined)?.data ?? [],
    [data]
  );

  const filtered = useMemo(
    () => rows.filter((p) => (p.category || '').toLowerCase() === CATEGORY),
    [rows]
  );

  const handleAcknowledge = (id: string): void => {
    if (!userId.trim()) return;
    acknowledgeMutation.mutate({ id, acknowledgmentData: { userId: userId.trim() } });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Regulatory Updates</h1>
        <p className="page-subtitle">Review and acknowledge regulatory update policies</p>
      </header>

      {acknowledgeMutation.isError && (
        <div className="alert alert-error" role="alert">
          {acknowledgeMutation.error instanceof Error
            ? acknowledgeMutation.error.message
            : 'Failed to acknowledge policy'}
        </div>
      )}

      <div className="search-bar" role="search">
        <label htmlFor="updates-user-id" className="sr-only">
          Acknowledging user ID
        </label>
        <input
          id="updates-user-id"
          type="text"
          placeholder="Enter your user ID to acknowledge policies..."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          aria-label="Acknowledging user ID"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading updates...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load updates. Please try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No regulatory update policies found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Regulatory update policies list">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Version</th>
                <th scope="col">Effective Date</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.title}</th>
                  <td>{row.version || 'N/A'}</td>
                  <td>
                    {row.effectiveDate ? (
                      <time dateTime={row.effectiveDate}>
                        {new Date(row.effectiveDate).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <span className="status-badge status-confirmed">{row.status || 'N/A'}</span>
                  </td>
                  <td>
                    <Link
                      to={`/compliance/${row.id}`}
                      className="btn-action"
                      aria-label={`View ${row.title}`}
                    >
                      View
                    </Link>
                    <button
                      className="btn-action"
                      onClick={() => handleAcknowledge(row.id)}
                      disabled={!userId.trim() || acknowledgeMutation.isPending}
                      aria-label={`Acknowledge ${row.title}`}
                    >
                      Acknowledge
                    </button>
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

export default Updates;

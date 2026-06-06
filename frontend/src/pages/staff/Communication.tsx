/**
 * WF-COMP-XXX | Communication.tsx - Communication
 * Purpose: React component for Communication functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useCommunications } from '../../hooks/useCommunications';
import '../../styles/Page.css';

interface CommunicationRow {
  id: string;
  type?: string;
  direction?: string;
  subject?: string;
  message?: string;
  status?: string;
  sentAt?: string;
}

const TYPE_OPTIONS = ['email', 'sms', 'phone', 'in-app'];

const Communication = () => {
  const [type, setType] = useState('');
  const { data, isLoading, isError } = useCommunications({
    limit: 50,
    type: type || undefined,
  });

  const communications = (data as { data?: CommunicationRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Internal Communication</h1>
        <p className="page-subtitle">Messages and notifications log</p>
      </header>

      <div className="form-group" style={{ maxWidth: '20rem' }}>
        <label htmlFor="comm-type-filter">Filter by type</label>
        <select
          id="comm-type-filter"
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading communications...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load communications. Please try again.</p>
          </div>
        ) : communications.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No communications found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Communications">
            <thead>
              <tr>
                <th scope="col">Sent</th>
                <th scope="col">Type</th>
                <th scope="col">Direction</th>
                <th scope="col">Subject</th>
                <th scope="col">Message</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {communications.map((comm) => (
                <tr key={comm.id}>
                  <th scope="row">
                    {comm.sentAt ? (
                      <time dateTime={comm.sentAt}>{new Date(comm.sentAt).toLocaleString()}</time>
                    ) : (
                      'N/A'
                    )}
                  </th>
                  <td>{comm.type ?? 'N/A'}</td>
                  <td>{comm.direction ?? 'N/A'}</td>
                  <td>{comm.subject ?? 'N/A'}</td>
                  <td>{comm.message ?? 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${comm.status ?? 'sent'}`}>
                      {comm.status ?? 'sent'}
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

export default Communication;

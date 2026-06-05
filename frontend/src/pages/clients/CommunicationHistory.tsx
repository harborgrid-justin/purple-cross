/**
 * WF-COMP-XXX | CommunicationHistory.tsx - Communication History
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for CommunicationHistory functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useClients } from '../../hooks/useClients';
import { useCommunications } from '../../hooks/useCommunications';
import '../../styles/Page.css';

interface ClientOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface CommunicationRow {
  id: string;
  type: string;
  subject?: string;
  content?: string;
  status?: string;
  createdAt: string;
  client?: { firstName: string; lastName: string };
}

const COMM_TYPES = ['email', 'sms', 'phone', 'in-person'];

const CommunicationHistory = () => {
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState('');

  const { data: clientsData, isLoading: clientsLoading } = useClients({ limit: 100 });
  const clients = (clientsData as { data?: ClientOption[] } | undefined)?.data ?? [];

  const { data, isLoading, isError } = useCommunications({
    clientId: clientId || undefined,
    type: type || undefined,
    limit: 100,
  });
  const communications = (data as { data?: CommunicationRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Communication History</h1>
        <p className="page-subtitle">Review every email, SMS, and call logged for a client</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="comm-client" className="sr-only">
          Filter by client
        </label>
        <select
          id="comm-client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          aria-label="Filter communications by client"
          disabled={clientsLoading}
        >
          <option value="">All Clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
        <label htmlFor="comm-type" className="sr-only">
          Filter by type
        </label>
        <select
          id="comm-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter communications by type"
        >
          <option value="">All Types</option>
          {COMM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading communication history...</p>
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
          <table className="data-table" role="table" aria-label="Communication history">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Client</th>
                <th scope="col">Type</th>
                <th scope="col">Subject</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {communications.map((comm) => {
                const status = comm.status ?? 'sent';
                return (
                  <tr key={comm.id}>
                    <th scope="row">
                      <time dateTime={comm.createdAt}>
                        {new Date(comm.createdAt).toLocaleString()}
                      </time>
                    </th>
                    <td>
                      {comm.client
                        ? `${comm.client.firstName} ${comm.client.lastName}`
                        : 'Unknown'}
                    </td>
                    <td>{comm.type}</td>
                    <td>{comm.subject || comm.content || 'N/A'}</td>
                    <td>
                      <span
                        className={`status-badge status-${status}`}
                        role="status"
                        aria-label={`Status: ${status}`}
                      >
                        {status}
                      </span>
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

export default CommunicationHistory;

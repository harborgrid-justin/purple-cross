/**
 * WF-COMP-XXX | AccountManagement.tsx - Account Management
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for AccountManagement functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import '../../styles/Page.css';

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status?: string;
  patients?: Array<{ id: string }>;
}

const PAGE_SIZE = 25;

const AccountManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useClients({
    search: searchTerm || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const clients = (data as { data?: ClientRow[] } | undefined)?.data ?? [];
  const meta = (data as { meta?: { total?: number; totalPages?: number } } | undefined)?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Account Management</h1>
        <p className="page-subtitle">Oversee client accounts, status, and contact details</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="account-search" className="sr-only">
          Search client accounts
        </label>
        <input
          id="account-search"
          type="search"
          placeholder="Search accounts by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          aria-label="Search client accounts"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading accounts...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load client accounts. Please try again.</p>
          </div>
        ) : clients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No client accounts found.</p>
          </div>
        ) : (
          <>
            <table className="data-table" role="table" aria-label="Client accounts">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Pets</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  const status = client.status ?? 'active';
                  return (
                    <tr key={client.id}>
                      <th scope="row">
                        {client.firstName} {client.lastName}
                      </th>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>{client.patients?.length ?? 0}</td>
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
                        <Link
                          to={`/clients/${client.id}`}
                          className="btn-action"
                          aria-label={`View account for ${client.firstName} ${client.lastName}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="form-actions" style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                Previous
              </button>
              <span role="status" aria-live="polite">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;

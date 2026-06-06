/**
 * WF-COMP-XXX | ClientPortal.tsx - Client Portal
 * Purpose: React component for ClientPortal functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React, { useState } from 'react';
import { useClientPortal } from '../../hooks/useClientPortal';
import '../../styles/Page.css';

interface PortalAccount {
  id: string;
  email?: string;
  status?: string;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
  client?: { firstName?: string; lastName?: string };
}

const ClientPortal: React.FC = () => {
  const [accountId, setAccountId] = useState('');
  const [lookupId, setLookupId] = useState('');

  const { data, isLoading, isError } = useClientPortal(lookupId);
  const account = (data as { data?: PortalAccount } | undefined)?.data;

  const handleLookup = (e: React.FormEvent): void => {
    e.preventDefault();
    setLookupId(accountId.trim());
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Portal</h1>
        <p className="page-subtitle">Look up and review a client portal account</p>
      </header>

      <form onSubmit={handleLookup} className="search-bar" role="search">
        <label htmlFor="portal-account-id" className="sr-only">
          Client portal account ID
        </label>
        <input
          id="portal-account-id"
          type="search"
          placeholder="Enter client portal account ID..."
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          aria-label="Client portal account ID"
        />
        <button type="submit" className="btn-primary" disabled={!accountId.trim()}>
          Look Up Account
        </button>
      </form>

      <div className="content-section">
        {!lookupId ? (
          <div role="status" aria-live="polite">
            <p>Enter a client portal account ID above to view account details.</p>
          </div>
        ) : isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading account...</p>
          </div>
        ) : isError || !account ? (
          <div className="alert alert-warning" role="alert">
            <p>Portal account not found.</p>
          </div>
        ) : (
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Account ID</dt>
              <dd>{account.id}</dd>
            </div>
            <div className="detail-row">
              <dt>Client</dt>
              <dd>
                {account.client
                  ? `${account.client.firstName ?? ''} ${account.client.lastName ?? ''}`.trim()
                  : 'N/A'}
              </dd>
            </div>
            <div className="detail-row">
              <dt>Email</dt>
              <dd>{account.email || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Status</dt>
              <dd>
                <span className="status-badge status-confirmed">{account.status || 'N/A'}</span>
              </dd>
            </div>
            <div className="detail-row">
              <dt>Two-Factor</dt>
              <dd>{account.twoFactorEnabled ? 'Enabled' : 'Disabled'}</dd>
            </div>
            <div className="detail-row">
              <dt>Last Login</dt>
              <dd>
                {account.lastLoginAt ? new Date(account.lastLoginAt).toLocaleString() : 'Never'}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;

/**
 * WF-COMP-XXX | PortalAccess.tsx - Portal Access
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for PortalAccess functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useClients } from '../../hooks/useClients';
import {
  useClientPortal,
  useCreateClientPortal,
  useDisableClientPortalTwoFactor,
} from '../../hooks/useClientPortal';
import '../../styles/Page.css';

interface ClientOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PortalAccount {
  id: string;
  email?: string;
  isActive?: boolean;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
}

const PortalAccess = () => {
  const [selectedClientId, setSelectedClientId] = useState('');

  const { data: clientsData, isLoading: clientsLoading } = useClients({ limit: 100 });
  const clients = (clientsData as { data?: ClientOption[] } | undefined)?.data ?? [];
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const { data, isLoading, isError } = useClientPortal(selectedClientId);
  const portal = (data as { data?: PortalAccount } | undefined)?.data;

  const createPortal = useCreateClientPortal();
  const disableTwoFactor = useDisableClientPortalTwoFactor();

  const handleEnable = (): void => {
    if (!selectedClient) return;
    createPortal.mutate({ clientId: selectedClient.id, email: selectedClient.email });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Portal Access</h1>
        <p className="page-subtitle">Manage self-service portal accounts for clients</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="portal-client" className="sr-only">
          Select a client
        </label>
        <select
          id="portal-client"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          aria-label="Select a client to manage portal access"
          disabled={clientsLoading}
        >
          <option value="">Select a client...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {!selectedClientId ? (
          <div role="status" aria-live="polite">
            <p>Select a client to view their portal access.</p>
          </div>
        ) : isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading portal account...</p>
          </div>
        ) : isError || !portal ? (
          <div className="content-section">
            <p>This client does not have a portal account yet.</p>
            {createPortal.isError && (
              <div className="alert alert-error" role="alert">
                {createPortal.error instanceof Error
                  ? createPortal.error.message
                  : 'Failed to enable portal access'}
              </div>
            )}
            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={handleEnable}
                disabled={createPortal.isPending}
              >
                {createPortal.isPending ? 'Enabling...' : 'Enable Portal Access'}
              </button>
            </div>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Portal account details">
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">Value</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Login Email</th>
                <td>{portal.email || selectedClient?.email || 'N/A'}</td>
                <td>—</td>
              </tr>
              <tr>
                <th scope="row">Account Status</th>
                <td>
                  <span
                    className={`status-badge status-${portal.isActive ? 'active' : 'inactive'}`}
                    role="status"
                    aria-label={portal.isActive ? 'Active' : 'Inactive'}
                  >
                    {portal.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>—</td>
              </tr>
              <tr>
                <th scope="row">Two-Factor Authentication</th>
                <td>{portal.twoFactorEnabled ? 'Enabled' : 'Disabled'}</td>
                <td>
                  {portal.twoFactorEnabled && (
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => disableTwoFactor.mutate(portal.id)}
                      disabled={disableTwoFactor.isPending}
                      aria-label="Disable two-factor authentication"
                    >
                      Disable 2FA
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">Last Login</th>
                <td>
                  {portal.lastLoginAt ? (
                    <time dateTime={portal.lastLoginAt}>
                      {new Date(portal.lastLoginAt).toLocaleString()}
                    </time>
                  ) : (
                    'Never'
                  )}
                </td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PortalAccess;

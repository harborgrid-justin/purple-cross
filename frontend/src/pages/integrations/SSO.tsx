/**
 * WF-COMP-XXX | SSO.tsx - S S O
 * Purpose: React component for SSO functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const ssoSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  domain: z.string().min(1, 'Domain is required'),
});

type SsoFormData = z.infer<typeof ssoSchema>;

interface SsoConnection {
  id: string;
  provider: string;
  clientId: string;
  domain: string;
  enabled: boolean;
}

const PROVIDERS = [
  { value: 'google', label: 'Google Workspace' },
  { value: 'okta', label: 'Okta' },
  { value: 'azure', label: 'Microsoft Entra ID' },
  { value: 'saml', label: 'Generic SAML 2.0' },
];

const SSO = () => {
  const [connections, setConnections] = useState<SsoConnection[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(ssoSchema);

  const onSubmit = (data: SsoFormData): void => {
    const connection: SsoConnection = {
      id: crypto.randomUUID(),
      provider: data.provider,
      clientId: data.clientId,
      domain: data.domain,
      enabled: true,
    };
    setConnections((prev) => [connection, ...prev]);
    reset();
  };

  const handleToggle = (id: string): void => {
    setConnections((prev) =>
      prev.map((conn) => (conn.id === id ? { ...conn, enabled: !conn.enabled } : conn))
    );
  };

  const handleRemove = (id: string): void => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Single Sign-On</h1>
      </header>
      <p className="page-subtitle">Configure identity providers for staff authentication.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Provider"
          registration={register('provider')}
          error={errors.provider}
          options={PROVIDERS}
          required
        />
        <FormField
          label="Client ID"
          registration={register('clientId')}
          error={errors.clientId}
          required
        />
        <FormField
          label="Domain"
          registration={register('domain')}
          error={errors.domain}
          placeholder="example.com"
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Connection
          </button>
        </div>
      </form>

      <h2>Configured Providers</h2>
      <div className="table-container">
        {connections.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No SSO providers configured yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="SSO connections">
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Client ID</th>
                <th scope="col">Domain</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((conn) => (
                <tr key={conn.id}>
                  <th scope="row">{conn.provider}</th>
                  <td>{conn.clientId}</td>
                  <td>{conn.domain}</td>
                  <td>
                    <span
                      className={`status-badge status-${conn.enabled ? 'confirmed' : 'cancelled'}`}
                      role="status"
                    >
                      {conn.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleToggle(conn.id)}
                      aria-label={`${conn.enabled ? 'Disable' : 'Enable'} ${conn.provider}`}
                    >
                      {conn.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => handleRemove(conn.id)}
                      aria-label={`Remove ${conn.provider}`}
                    >
                      Remove
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

export default SSO;

/**
 * WF-COMP-XXX | Accounting.tsx - Accounting
 * Purpose: React component for Accounting functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const accountingSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  accountId: z.string().min(1, 'Account ID is required'),
  syncFrequency: z.string().min(1, 'Sync frequency is required'),
});

type AccountingFormData = z.infer<typeof accountingSchema>;

interface AccountingConnection {
  id: string;
  provider: string;
  accountId: string;
  syncFrequency: string;
  connected: boolean;
  lastSync: string | null;
}

const PROVIDERS = [
  { value: 'quickbooks', label: 'QuickBooks' },
  { value: 'xero', label: 'Xero' },
  { value: 'sage', label: 'Sage' },
  { value: 'freshbooks', label: 'FreshBooks' },
];

const FREQUENCIES = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'manual', label: 'Manual' },
];

const Accounting = () => {
  const [connections, setConnections] = useState<AccountingConnection[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(accountingSchema);

  const onSubmit = (data: AccountingFormData): void => {
    const connection: AccountingConnection = {
      id: crypto.randomUUID(),
      provider: data.provider,
      accountId: data.accountId,
      syncFrequency: data.syncFrequency,
      connected: true,
      lastSync: null,
    };
    setConnections((prev) => [connection, ...prev]);
    reset();
  };

  const handleSync = (id: string): void => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === id ? { ...conn, lastSync: new Date().toISOString() } : conn
      )
    );
  };

  const handleDisconnect = (id: string): void => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Accounting Software</h1>
      </header>
      <p className="page-subtitle">Sync invoices and payments with your accounting platform.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Provider"
          registration={register('provider')}
          error={errors.provider}
          options={PROVIDERS}
          required
        />
        <FormField
          label="Account ID"
          registration={register('accountId')}
          error={errors.accountId}
          required
        />
        <FormField
          label="Sync Frequency"
          registration={register('syncFrequency')}
          error={errors.syncFrequency}
          options={FREQUENCIES}
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Connect
          </button>
        </div>
      </form>

      <h2>Connections</h2>
      <div className="table-container">
        {connections.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No accounting connections configured yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Accounting connections">
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Account</th>
                <th scope="col">Frequency</th>
                <th scope="col">Last Sync</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((conn) => (
                <tr key={conn.id}>
                  <th scope="row">{conn.provider}</th>
                  <td>{conn.accountId}</td>
                  <td>{conn.syncFrequency}</td>
                  <td>
                    {conn.lastSync ? (
                      <time dateTime={conn.lastSync}>
                        {new Date(conn.lastSync).toLocaleString()}
                      </time>
                    ) : (
                      'Never'
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleSync(conn.id)}
                      aria-label={`Sync ${conn.provider}`}
                    >
                      Sync Now
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => handleDisconnect(conn.id)}
                      aria-label={`Disconnect ${conn.provider}`}
                    >
                      Disconnect
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

export default Accounting;

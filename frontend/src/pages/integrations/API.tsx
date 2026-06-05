/**
 * WF-COMP-XXX | API.tsx - A P I
 * Purpose: API service for API.tsx endpoints and operations
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const apiKeySchema = z.object({
  label: z.string().min(1, 'Label is required'),
  scope: z.string().min(1, 'Scope is required'),
});

type ApiKeyFormData = z.infer<typeof apiKeySchema>;

interface ApiKey {
  id: string;
  label: string;
  scope: string;
  token: string;
  createdAt: string;
}

const SCOPES = [
  { value: 'read', label: 'Read Only' },
  { value: 'write', label: 'Read & Write' },
  { value: 'admin', label: 'Full Admin' },
];

const generateToken = (): string =>
  `pk_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

const API = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(apiKeySchema);

  const onSubmit = (data: ApiKeyFormData): void => {
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      label: data.label,
      scope: data.scope,
      token: generateToken(),
      createdAt: new Date().toISOString(),
    };
    setKeys((prev) => [newKey, ...prev]);
    reset();
  };

  const handleRevoke = (id: string): void => {
    setKeys((prev) => prev.filter((key) => key.id !== id));
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>RESTful API</h1>
      </header>
      <p className="page-subtitle">Generate and manage API keys for programmatic access.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="Key Label" registration={register('label')} error={errors.label} required />
        <FormField
          label="Scope"
          registration={register('scope')}
          error={errors.scope}
          options={SCOPES}
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Generate API Key
          </button>
        </div>
      </form>

      <h2>Active Keys</h2>
      <div className="table-container">
        {keys.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No API keys generated yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="API keys">
            <thead>
              <tr>
                <th scope="col">Label</th>
                <th scope="col">Scope</th>
                <th scope="col">Token</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id}>
                  <th scope="row">{key.label}</th>
                  <td>{key.scope}</td>
                  <td>
                    <code>{key.token}</code>
                  </td>
                  <td>
                    <time dateTime={key.createdAt}>
                      {new Date(key.createdAt).toLocaleDateString()}
                    </time>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleRevoke(key.id)}
                      aria-label={`Revoke ${key.label}`}
                    >
                      Revoke
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

export default API;

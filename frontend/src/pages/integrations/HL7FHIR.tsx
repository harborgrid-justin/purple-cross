/**
 * WF-COMP-XXX | HL7FHIR.tsx - H L7 F H I R
 * Purpose: React component for HL7FHIR functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const fhirSchema = z.object({
  name: z.string().min(1, 'Connection name is required'),
  baseUrl: z.string().url('Must be a valid URL'),
  version: z.string().min(1, 'Version is required'),
});

type FhirFormData = z.infer<typeof fhirSchema>;

interface FhirConnection {
  id: string;
  name: string;
  baseUrl: string;
  version: string;
  status: 'active' | 'paused';
}

const VERSIONS = [
  { value: 'R4', label: 'FHIR R4' },
  { value: 'R4B', label: 'FHIR R4B' },
  { value: 'R5', label: 'FHIR R5' },
  { value: 'HL7v2', label: 'HL7 v2.x' },
];

const HL7FHIR = () => {
  const [connections, setConnections] = useState<FhirConnection[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(fhirSchema);

  const onSubmit = (data: FhirFormData): void => {
    const connection: FhirConnection = {
      id: crypto.randomUUID(),
      name: data.name,
      baseUrl: data.baseUrl,
      version: data.version,
      status: 'active',
    };
    setConnections((prev) => [connection, ...prev]);
    reset();
  };

  const handleToggle = (id: string): void => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === id
          ? { ...conn, status: conn.status === 'active' ? 'paused' : 'active' }
          : conn
      )
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>HL7/FHIR</h1>
      </header>
      <p className="page-subtitle">Connect to external clinical systems using HL7/FHIR.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Connection Name"
          registration={register('name')}
          error={errors.name}
          required
        />
        <FormField
          label="Base URL"
          registration={register('baseUrl')}
          error={errors.baseUrl}
          placeholder="https://fhir.example.com/r4"
          required
        />
        <FormField
          label="Version"
          registration={register('version')}
          error={errors.version}
          options={VERSIONS}
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Connection
          </button>
        </div>
      </form>

      <h2>Connections</h2>
      <div className="table-container">
        {connections.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No HL7/FHIR connections configured yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="HL7/FHIR connections">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Base URL</th>
                <th scope="col">Version</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((conn) => (
                <tr key={conn.id}>
                  <th scope="row">{conn.name}</th>
                  <td>{conn.baseUrl}</td>
                  <td>{conn.version}</td>
                  <td>
                    <span
                      className={`status-badge status-${conn.status === 'active' ? 'confirmed' : 'pending'}`}
                      role="status"
                    >
                      {conn.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleToggle(conn.id)}
                      aria-label={`${conn.status === 'active' ? 'Pause' : 'Activate'} ${conn.name}`}
                    >
                      {conn.status === 'active' ? 'Pause' : 'Activate'}
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

export default HL7FHIR;

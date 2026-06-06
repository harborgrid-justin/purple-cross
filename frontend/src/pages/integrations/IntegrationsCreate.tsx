/**
 * WF-COMP-INTEGRATIONS-005 | IntegrationsCreate.tsx - Create integrations page
 * Purpose: Form page for creating new integrations
 * Related: Integrations form component, integrations store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const integrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  endpoint: z.string().url('Must be a valid URL'),
});

type IntegrationFormData = z.infer<typeof integrationSchema>;

const TYPES = [
  { value: 'accounting', label: 'Accounting' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'sso', label: 'Single Sign-On' },
  { value: 'fhir', label: 'HL7/FHIR' },
  { value: 'other', label: 'Other' },
];

const IntegrationsCreate: React.FC = () => {
  const [created, setCreated] = useState<IntegrationFormData | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(integrationSchema);

  const onSubmit = (data: IntegrationFormData): void => {
    setCreated(data);
    reset();
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔗</span> Create New Integration
        </h1>
        <Link to="/integrations" className="btn-secondary">
          Cancel
        </Link>
      </header>
      <p className="page-subtitle">Configure a new external integration connection.</p>

      {created && (
        <div className="alert alert-success" role="status">
          <p>
            Integration &ldquo;{created.name}&rdquo; ({created.type}) configured for{' '}
            {created.endpoint}.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="Name" registration={register('name')} error={errors.name} required />
        <FormField
          label="Type"
          registration={register('type')}
          error={errors.type}
          options={TYPES}
          required
        />
        <FormField
          label="Endpoint URL"
          registration={register('endpoint')}
          error={errors.endpoint}
          placeholder="https://api.example.com"
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Create Integration
          </button>
          <Link to="/integrations" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default IntegrationsCreate;

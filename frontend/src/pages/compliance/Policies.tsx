/**
 * WF-COMP-XXX | Policies.tsx - Policies
 * Purpose: React component for Policies functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { usePolicies, useCreatePolicy } from '../../hooks/usePolicies';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-policy validation.
const policySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  version: z.string().min(1, 'Version is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
});

type PolicyFormData = z.infer<typeof policySchema>;

interface PolicyRow {
  id: string;
  title: string;
  category: string;
  version?: string;
  status?: string;
  effectiveDate?: string;
}

const Policies: React.FC = () => {
  const { data, isLoading, isError } = usePolicies({ limit: 50 });
  const createMutation = useCreatePolicy();

  const rows = (data as { data?: PolicyRow[] } | undefined)?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(policySchema);

  const onSubmit = (form: PolicyFormData): void => {
    createMutation.mutate(form, {
      onSuccess: () =>
        reset({ title: '', category: '', content: '', version: '', effectiveDate: '' }),
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Policy Management</h1>
        <p className="page-subtitle">Create and manage practice policies</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create policy'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="Title" registration={register('title')} error={errors.title} required />
        <FormField
          label="Category"
          registration={register('category')}
          error={errors.category}
          required
        />
        <FormField
          label="Content"
          registration={register('content')}
          error={errors.content}
          required
        />
        <FormField
          label="Version"
          registration={register('version')}
          error={errors.version}
          placeholder="1.0"
          required
        />
        <FormField
          label="Effective Date"
          type="date"
          registration={register('effectiveDate')}
          error={errors.effectiveDate}
          required
        />
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Policy'}
          </button>
        </div>
      </form>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading policies...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load policies. Please try again.</p>
          </div>
        ) : rows.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No policies found. Create one above to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Policies list">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Version</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.title}</th>
                  <td>{row.category}</td>
                  <td>{row.version || 'N/A'}</td>
                  <td>
                    <span className="status-badge status-confirmed">{row.status || 'N/A'}</span>
                  </td>
                  <td>
                    <Link
                      to={`/compliance/${row.id}`}
                      className="btn-action"
                      aria-label={`View ${row.title}`}
                    >
                      View
                    </Link>
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

export default Policies;

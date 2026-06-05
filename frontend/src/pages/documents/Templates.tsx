/**
 * WF-COMP-XXX | Templates.tsx - Templates
 * Purpose: React component for Templates functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import { z } from 'zod';
import {
  useDocumentTemplates,
  useCreateDocumentTemplate,
} from '../../hooks/useDocumentTemplates';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-template validation (name/category/template required).
const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  body: z.string().min(1, 'Template body is required'),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateRow {
  id: string;
  name: string;
  category: string;
  usageCount?: number;
  status?: string;
}

const Templates: React.FC = () => {
  const { data, isLoading, isError } = useDocumentTemplates({ limit: 50 });
  const createMutation = useCreateDocumentTemplate();

  const rows = (data as { data?: TemplateRow[] } | undefined)?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(templateSchema);

  const onSubmit = (form: TemplateFormData): void => {
    createMutation.mutate(
      {
        name: form.name,
        category: form.category,
        template: { body: form.body },
      },
      { onSuccess: () => reset({ name: '', category: '', body: '' }) }
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Templates</h1>
        <p className="page-subtitle">Create and manage reusable document templates</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create template'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="Name" registration={register('name')} error={errors.name} required />
        <FormField
          label="Category"
          registration={register('category')}
          error={errors.category}
          required
        />
        <FormField
          label="Template Body"
          registration={register('body')}
          error={errors.body}
          required
        />
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Template'}
          </button>
        </div>
      </form>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading templates...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load templates. Please try again.</p>
          </div>
        ) : rows.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No templates found. Create one above to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Document templates list">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Usage Count</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.name}</th>
                  <td>{row.category}</td>
                  <td>{row.usageCount ?? 0}</td>
                  <td>
                    <span className="status-badge status-confirmed">{row.status || 'N/A'}</span>
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

export default Templates;

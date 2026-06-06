/**
 * WF-COMP-DOCUMENTS-006 | DocumentsEdit.tsx - Edit documents page
 * Purpose: Form page for editing existing documents
 * Related: Documents form component, documents store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useDocument, useUpdateDocument } from '../../hooks/useDocuments';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend update-document validation (description/category only).
const editSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

interface DocumentRecord {
  category?: string;
  description?: string;
}

const DocumentsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDocument(id || '');
  const updateMutation = useUpdateDocument();

  const record = (data as { data?: DocumentRecord } | undefined)?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(editSchema);

  useEffect(() => {
    if (record) {
      reset({
        category: record.category || '',
        description: record.description || '',
      });
    }
  }, [record, reset]);

  const onSubmit = (formData: EditFormData): void => {
    if (!id) return;
    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => navigate(`/documents/${id}`),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📄</span> Edit Document
        </h1>
        <Link to={`/documents/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update document'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Category"
          registration={register('category')}
          error={errors.category}
          required
        />
        <FormField
          label="Description"
          registration={register('description')}
          error={errors.description}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/documents/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DocumentsEdit;

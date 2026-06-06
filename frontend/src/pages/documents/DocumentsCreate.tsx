/**
 * WF-COMP-DOCUMENTS-005 | DocumentsCreate.tsx - Create documents page
 * Purpose: Form page for creating new documents
 * Related: Documents form component, documents store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateDocument } from '../../hooks/useDocuments';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-document validation
// (fileName/fileType/fileSize/filePath/entityType/entityId/category required).
const documentSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.coerce.number().int().min(0, 'File size must be 0 or greater'),
  filePath: z.string().min(1, 'File path is required'),
  entityType: z.string().min(1, 'Entity type is required'),
  entityId: z.string().uuid('Entity ID must be a valid UUID'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const DocumentsCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateDocument();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(documentSchema);

  const onSubmit = (data: DocumentFormData): void => {
    createMutation.mutate(data, {
      onSuccess: (response) => {
        const id = (response as { data?: { id?: string } })?.data?.id;
        navigate(id ? `/documents/${id}` : '/documents');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📄</span> Create New Document
        </h1>
        <p className="page-subtitle">Register a document in the system</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create document'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="File Name"
          registration={register('fileName')}
          error={errors.fileName}
          required
        />
        <FormField
          label="File Type"
          registration={register('fileType')}
          error={errors.fileType}
          placeholder="application/pdf"
          required
        />
        <FormField
          label="File Size (bytes)"
          type="number"
          registration={register('fileSize')}
          error={errors.fileSize}
          required
        />
        <FormField
          label="File Path"
          registration={register('filePath')}
          error={errors.filePath}
          required
        />
        <FormField
          label="Entity Type"
          registration={register('entityType')}
          error={errors.entityType}
          placeholder="patient"
          required
        />
        <FormField
          label="Entity ID"
          registration={register('entityId')}
          error={errors.entityId}
          required
        />
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
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Document'}
          </button>
          <Link to="/documents" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DocumentsCreate;

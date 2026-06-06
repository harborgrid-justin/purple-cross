/**
 * WF-COMP-XXX | ESignature.tsx - E Signature
 * Purpose: React component for ESignature functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import { z } from 'zod';
import { useDocumentTemplates, useSignDocument } from '../../hooks/useDocumentTemplates';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend sign-document validation
// (documentId/signedBy/signatureData required).
const signSchema = z.object({
  documentId: z.string().uuid('Document ID must be a valid UUID'),
  signedBy: z.string().uuid('Signer ID must be a valid UUID'),
  signatureData: z.string().min(1, 'Signature is required'),
});

type SignFormData = z.infer<typeof signSchema>;

interface TemplateRow {
  id: string;
  name: string;
  category: string;
  status?: string;
}

const ESignature: React.FC = () => {
  const { data, isLoading, isError } = useDocumentTemplates({ limit: 50 });
  const signMutation = useSignDocument();

  const rows = (data as { data?: TemplateRow[] } | undefined)?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(signSchema);

  const onSubmit = (form: SignFormData): void => {
    signMutation.mutate(form, {
      onSuccess: () => reset({ documentId: '', signedBy: '', signatureData: '' }),
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>E-Signature Integration</h1>
        <p className="page-subtitle">Capture electronic signatures on documents</p>
      </header>

      {signMutation.isError && (
        <div className="alert alert-error" role="alert">
          {signMutation.error instanceof Error
            ? signMutation.error.message
            : 'Failed to sign document'}
        </div>
      )}
      {signMutation.isSuccess && (
        <div className="alert alert-success" role="status">
          Document signed successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Document ID"
          registration={register('documentId')}
          error={errors.documentId}
          required
        />
        <FormField
          label="Signer ID"
          registration={register('signedBy')}
          error={errors.signedBy}
          required
        />
        <FormField
          label="Signature"
          registration={register('signatureData')}
          error={errors.signatureData}
          placeholder="Type full name to sign"
          required
        />
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || signMutation.isPending}
          >
            {signMutation.isPending ? 'Signing...' : 'Sign Document'}
          </button>
        </div>
      </form>

      <h2>Signable Templates</h2>
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
            <p>No templates available for signing.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Signable templates list">
            <thead>
              <tr>
                <th scope="col">Template</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.name}</th>
                  <td>{row.category}</td>
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

export default ESignature;

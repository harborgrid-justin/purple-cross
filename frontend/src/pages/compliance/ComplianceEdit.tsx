/**
 * WF-COMP-COMPLIANCE-006 | ComplianceEdit.tsx - Edit compliance page
 * Purpose: Form page for editing existing compliance
 * Related: Compliance form component, compliance store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { usePolicy, useUpdatePolicy } from '../../hooks/usePolicies';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend update-policy validation (all fields optional).
const editSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  version: z.string().min(1, 'Version is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  reviewDate: z.string().optional(),
  status: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

interface PolicyRecord {
  title?: string;
  category?: string;
  content?: string;
  version?: string;
  effectiveDate?: string;
  reviewDate?: string;
  status?: string;
}

const STATUSES = ['active', 'draft', 'archived'].map((v) => ({ value: v, label: v }));

const ComplianceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = usePolicy(id || '');
  const updateMutation = useUpdatePolicy();

  const record = (data as { data?: PolicyRecord } | undefined)?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(editSchema);

  useEffect(() => {
    if (record) {
      reset({
        title: record.title || '',
        category: record.category || '',
        content: record.content || '',
        version: record.version || '',
        effectiveDate: record.effectiveDate
          ? new Date(record.effectiveDate).toISOString().split('T')[0]
          : '',
        reviewDate: record.reviewDate
          ? new Date(record.reviewDate).toISOString().split('T')[0]
          : '',
        status: record.status || 'active',
      });
    }
  }, [record, reset]);

  const onSubmit = (formData: EditFormData): void => {
    if (!id) return;
    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => navigate(`/compliance/${id}`),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading policy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✅</span> Edit Compliance Policy
        </h1>
        <Link to={`/compliance/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update policy'}
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
          required
        />
        <FormField
          label="Effective Date"
          type="date"
          registration={register('effectiveDate')}
          error={errors.effectiveDate}
          required
        />
        <FormField
          label="Review Date"
          type="date"
          registration={register('reviewDate')}
          error={errors.reviewDate}
        />
        <FormField
          label="Status"
          registration={register('status')}
          error={errors.status}
          options={STATUSES}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/compliance/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ComplianceEdit;

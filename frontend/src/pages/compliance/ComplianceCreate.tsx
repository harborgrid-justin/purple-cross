/**
 * WF-COMP-COMPLIANCE-005 | ComplianceCreate.tsx - Create compliance page
 * Purpose: Form page for creating new compliance
 * Related: Compliance form component, compliance store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreatePolicy } from '../../hooks/usePolicies';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-policy validation
// (title/category/content/version/effectiveDate required).
const policySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  version: z.string().min(1, 'Version is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  reviewDate: z.string().optional(),
});

type PolicyFormData = z.infer<typeof policySchema>;

const CATEGORIES = [
  'hipaa',
  'license',
  'controlled-substance',
  'incident',
  'record-retention',
  'audit',
  'regulatory-update',
  'general',
].map((v) => ({ value: v, label: v }));

const ComplianceCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreatePolicy();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(policySchema);

  const onSubmit = (data: PolicyFormData): void => {
    createMutation.mutate(data, {
      onSuccess: (response) => {
        const id = (response as { data?: { id?: string } })?.data?.id;
        navigate(id ? `/compliance/${id}` : '/compliance');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✅</span> Create New Compliance Policy
        </h1>
        <p className="page-subtitle">Add a policy to the compliance register</p>
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
          options={CATEGORIES}
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
        <FormField
          label="Review Date"
          type="date"
          registration={register('reviewDate')}
          error={errors.reviewDate}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Policy'}
          </button>
          <Link to="/compliance" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ComplianceCreate;

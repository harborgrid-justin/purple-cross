/**
 * WF-COMP-REPORTS-005 | ReportsCreate.tsx - Create reports page
 * Purpose: Form page for creating new reports
 * Related: Reports form component, reports store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateReportTemplate } from '../../hooks/useReportTemplates';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const reportTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  format: z.string().min(1, 'Format is required'),
});

type ReportTemplateFormData = z.infer<typeof reportTemplateSchema>;

const CATEGORIES = ['Financial', 'Operational', 'Clinical', 'Client', 'Inventory'].map((v) => ({
  value: v,
  label: v,
}));

const FORMATS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel (XLSX)' },
  { value: 'json', label: 'JSON' },
];

const ReportsCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateReportTemplate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(reportTemplateSchema);

  const onSubmit = (data: ReportTemplateFormData): void => {
    createMutation.mutate(data, {
      onSuccess: (response) => {
        const id = (response as { data?: { id?: string } })?.data?.id;
        navigate(id ? `/reports/${id}` : '/reports');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📊</span> Create New Report Template
        </h1>
        <Link to="/reports" className="btn-secondary">
          Cancel
        </Link>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create report template'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="Name" registration={register('name')} error={errors.name} required />
        <FormField
          label="Category"
          registration={register('category')}
          error={errors.category}
          options={CATEGORIES}
          required
        />
        <FormField
          label="Description"
          registration={register('description')}
          error={errors.description}
        />
        <FormField
          label="Output Format"
          registration={register('format')}
          error={errors.format}
          options={FORMATS}
          required
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating…' : 'Create Template'}
          </button>
          <Link to="/reports" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ReportsCreate;

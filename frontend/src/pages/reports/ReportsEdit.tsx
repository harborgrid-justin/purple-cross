/**
 * WF-COMP-REPORTS-006 | ReportsEdit.tsx - Edit reports page
 * Purpose: Form page for editing existing reports
 * Related: Reports form component, reports store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReportTemplate, useUpdateReportTemplate } from '../../hooks/useReportTemplates';
import '../../styles/Page.css';

interface ReportTemplate {
  name?: string;
  category?: string;
  description?: string;
  format?: string;
}

interface ReportTemplateFormData {
  name: string;
  category: string;
  description: string;
  format: string;
}

const CATEGORIES = ['Financial', 'Operational', 'Clinical', 'Client', 'Inventory'];
const FORMATS: Array<{ value: string; label: string }> = [
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel (XLSX)' },
  { value: 'json', label: 'JSON' },
];

const ReportsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading: fetchLoading } = useReportTemplate(id ?? '');
  const updateMutation = useUpdateReportTemplate();

  const template = (data as { data?: ReportTemplate } | undefined)?.data;

  const [formData, setFormData] = useState<ReportTemplateFormData>({
    name: '',
    category: '',
    description: '',
    format: '',
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name ?? '',
        category: template.category ?? '',
        description: template.description ?? '',
        format: template.format ?? '',
      });
    }
  }, [template]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!id) return;

    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description || undefined,
      format: formData.format,
    };

    updateMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          navigate(`/reports/${id}`);
        },
      }
    );
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading report template…</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Report template not found.</p>
        </div>
        <Link to="/reports" className="btn-secondary">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📊</span> Edit Report Template
        </h1>
        <Link to={`/reports/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update report template'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="format">Output Format</label>
          <select id="format" name="format" value={formData.format} onChange={handleChange}>
            <option value="">Select…</option>
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to={`/reports/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ReportsEdit;

/**
 * WF-COMP-REPORTS-004 | ReportsDetail.tsx - Reports detail page
 * Purpose: Display detailed information for a single reports
 * Related: Reports details component, reports store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReportTemplate } from '../../hooks/useReportTemplates';
import '../../styles/Page.css';

interface ReportTemplate {
  id?: string;
  name?: string;
  category?: string;
  description?: string;
  format?: string;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

const ReportsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useReportTemplate(id ?? '');

  const template = (data as { data?: ReportTemplate } | undefined)?.data;

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📊</span> Report Template Details
        </h1>
        <div>
          <Link to={`/reports/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/reports" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading report template…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load report template. Please try again.</p>
        </div>
      ) : !template ? (
        <div className="alert alert-warning" role="alert">
          <p>Report template not found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table" role="table" aria-label="Report template details">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{template.name ?? 'N/A'}</td>
              </tr>
              <tr>
                <th scope="row">Category</th>
                <td>{template.category ?? 'N/A'}</td>
              </tr>
              <tr>
                <th scope="row">Description</th>
                <td>{template.description ?? 'N/A'}</td>
              </tr>
              <tr>
                <th scope="row">Format</th>
                <td>{template.format ?? 'N/A'}</td>
              </tr>
              <tr>
                <th scope="row">Usage Count</th>
                <td>{template.usageCount ?? 0}</td>
              </tr>
              <tr>
                <th scope="row">Created</th>
                <td>
                  {template.createdAt ? new Date(template.createdAt).toLocaleString() : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsDetail;

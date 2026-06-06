/**
 * WF-COMP-XXX | Export.tsx - Export
 * Purpose: React component for Export functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useReportTemplates } from '../../hooks/useReportTemplates';
import '../../styles/Page.css';

interface ReportTemplate {
  id: string;
  name: string;
  category?: string;
  format?: string;
  usageCount?: number;
  createdAt?: string;
}

const triggerDownload = (filename: string, content: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const toCsv = (rows: ReportTemplate[]): string => {
  const headers = ['id', 'name', 'category', 'format', 'usageCount', 'createdAt'];
  const escape = (value: string | number | undefined): string => {
    const str = value == null ? '' : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = rows.map((row) =>
    [row.id, row.name, row.category, row.format, row.usageCount, row.createdAt]
      .map(escape)
      .join(',')
  );
  return [headers.join(','), ...lines].join('\n');
};

const Export = () => {
  const { data, isLoading, isError } = useReportTemplates({ limit: 100 });

  const templates = (data as { data?: ReportTemplate[] } | undefined)?.data ?? [];

  const handleExportJson = (): void => {
    triggerDownload(
      'report-templates.json',
      JSON.stringify(templates, null, 2),
      'application/json'
    );
  };

  const handleExportCsv = (): void => {
    triggerDownload('report-templates.csv', toCsv(templates), 'text/csv');
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Export &amp; Scheduling</h1>
        <div>
          <button
            className="btn-primary"
            onClick={handleExportJson}
            disabled={templates.length === 0}
            aria-label="Export report templates as JSON"
          >
            Export JSON
          </button>
          <button
            className="btn-secondary"
            onClick={handleExportCsv}
            disabled={templates.length === 0}
            aria-label="Export report templates as CSV"
            style={{ marginLeft: '0.5rem' }}
          >
            Export CSV
          </button>
        </div>
      </header>
      <p className="page-subtitle">
        Download your report templates for offline use or scheduling pipelines.
      </p>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading report templates…</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load report templates. Please try again.</p>
          </div>
        ) : templates.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No report templates available to export.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Report templates">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Format</th>
                <th scope="col">Usage</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <th scope="row">{template.name}</th>
                  <td>{template.category ?? 'N/A'}</td>
                  <td>{template.format ?? 'N/A'}</td>
                  <td>{template.usageCount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Export;

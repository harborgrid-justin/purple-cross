/**
 * WF-COMP-XXX | Analytics.tsx - Analytics
 * Purpose: React component for Analytics functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React, { useMemo } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import '../../styles/Page.css';

interface DocumentRow {
  id: string;
  category?: string;
  status?: string;
  fileSize?: number;
}

const Analytics: React.FC = () => {
  const { data, isLoading, isError } = useDocuments({ limit: 50 });

  const rows = (data as { data?: DocumentRow[] } | undefined)?.data ?? [];

  const stats = useMemo(() => {
    const total = rows.length;
    const totalSize = rows.reduce((sum, d) => sum + (d.fileSize ?? 0), 0);
    const byCategory = new Map<string, number>();
    const byStatus = new Map<string, number>();
    for (const doc of rows) {
      const cat = doc.category || 'Uncategorized';
      const st = doc.status || 'unknown';
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + 1);
      byStatus.set(st, (byStatus.get(st) ?? 0) + 1);
    }
    return { total, totalSize, byCategory, byStatus };
  }, [rows]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Analytics</h1>
        <p className="page-subtitle">Aggregate insights across stored documents</p>
      </header>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading analytics...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load analytics. Please try again.</p>
        </div>
      ) : (
        <div className="content-section">
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Total Documents</dt>
              <dd>{stats.total}</dd>
            </div>
            <div className="detail-row">
              <dt>Total Size</dt>
              <dd>{stats.totalSize} bytes</dd>
            </div>
          </dl>

          <h2>Documents by Category</h2>
          <div className="table-container">
            <table className="data-table" role="table" aria-label="Documents by category">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.byCategory.size === 0 ? (
                  <tr>
                    <td colSpan={2}>No data available.</td>
                  </tr>
                ) : (
                  Array.from(stats.byCategory.entries()).map(([cat, count]) => (
                    <tr key={cat}>
                      <th scope="row">{cat}</th>
                      <td>{count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h2>Documents by Status</h2>
          <div className="table-container">
            <table className="data-table" role="table" aria-label="Documents by status">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.byStatus.size === 0 ? (
                  <tr>
                    <td colSpan={2}>No data available.</td>
                  </tr>
                ) : (
                  Array.from(stats.byStatus.entries()).map(([st, count]) => (
                    <tr key={st}>
                      <th scope="row">{st}</th>
                      <td>{count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

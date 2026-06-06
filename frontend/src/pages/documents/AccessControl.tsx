/**
 * WF-COMP-XXX | AccessControl.tsx - Access Control
 * Purpose: React component for AccessControl functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import '../../styles/Page.css';

interface DocumentRow {
  id: string;
  title?: string;
  fileName?: string;
  category?: string;
  status?: string;
  relatedType?: string;
  uploadedBy?: string;
}

const AccessControl: React.FC = () => {
  const { data, isLoading, isError } = useDocuments({ limit: 50 });

  const rows = (data as { data?: DocumentRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Access Control</h1>
        <p className="page-subtitle">Review document ownership and access status</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading documents...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load documents. Please try again.</p>
          </div>
        ) : rows.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No documents found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Document access control list">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Related To</th>
                <th scope="col">Uploaded By</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((doc) => (
                <tr key={doc.id}>
                  <th scope="row">{doc.title || doc.fileName || 'Untitled'}</th>
                  <td>{doc.category || 'N/A'}</td>
                  <td>{doc.relatedType || 'N/A'}</td>
                  <td>{doc.uploadedBy || 'N/A'}</td>
                  <td>
                    <span className="status-badge status-confirmed">{doc.status || 'N/A'}</span>
                  </td>
                  <td>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="btn-action"
                      aria-label={`Manage access for ${doc.title || doc.fileName || 'document'}`}
                    >
                      Manage
                    </Link>
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

export default AccessControl;

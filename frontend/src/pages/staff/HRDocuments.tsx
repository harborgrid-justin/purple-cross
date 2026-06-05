/**
 * WF-COMP-XXX | HRDocuments.tsx - H R Documents
 * Purpose: React component for HRDocuments functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import '../../styles/Page.css';

interface HrDoc {
  id: string;
  title?: string;
  fileName?: string;
  fileUrl?: string;
  category?: string;
  status?: string;
  uploadedAt?: string;
}

const HRDocuments = () => {
  const [entityId, setEntityId] = useState('');
  const { data, isLoading, isError } = useDocuments({
    limit: 50,
    entityType: 'staff',
    entityId: entityId || undefined,
  });

  const documents = (data as { data?: HrDoc[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>HR Documents</h1>
        <p className="page-subtitle">Employee records and HR paperwork</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="hr-entity-filter" className="sr-only">
          Filter HR documents by staff ID
        </label>
        <input
          id="hr-entity-filter"
          type="search"
          placeholder="Filter by staff ID..."
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          aria-label="Filter HR documents by staff ID"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading HR documents...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load HR documents. Please try again.</p>
          </div>
        ) : documents.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No HR documents found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="HR documents">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">File</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col">Uploaded</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <th scope="row">{doc.title ?? 'Untitled'}</th>
                  <td>{doc.fileName ?? 'N/A'}</td>
                  <td>{doc.category ?? 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${doc.status ?? 'active'}`}>
                      {doc.status ?? 'active'}
                    </span>
                  </td>
                  <td>
                    {doc.uploadedAt ? (
                      <time dateTime={doc.uploadedAt}>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        className="btn-action"
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${doc.title ?? doc.fileName ?? 'document'}`}
                      >
                        Open
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
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

export default HRDocuments;

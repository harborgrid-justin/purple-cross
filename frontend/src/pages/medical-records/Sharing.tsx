/**
 * WF-COMP-XXX | Sharing.tsx - Sharing
 * Purpose: React component for Sharing functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import '../../styles/Page.css';

interface SharedDoc {
  id: string;
  title?: string;
  fileName?: string;
  fileUrl?: string;
  status?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

const Sharing = () => {
  const [entityId, setEntityId] = useState('');
  const { data, isLoading, isError } = useDocuments({
    limit: 50,
    entityType: 'medical-record',
    entityId: entityId || undefined,
  });

  const documents = (data as { data?: SharedDoc[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Record Sharing</h1>
        <p className="page-subtitle">Documents shared from medical records</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="sharing-entity-filter" className="sr-only">
          Filter shared records by record ID
        </label>
        <input
          id="sharing-entity-filter"
          type="search"
          placeholder="Filter by medical record ID..."
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          aria-label="Filter shared records by record ID"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading shared records...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load shared records. Please try again.</p>
          </div>
        ) : documents.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No shared records found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Shared records">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">File</th>
                <th scope="col">Status</th>
                <th scope="col">Shared By</th>
                <th scope="col">Shared On</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <th scope="row">{doc.title ?? 'Untitled'}</th>
                  <td>{doc.fileName ?? 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${doc.status ?? 'active'}`}>
                      {doc.status ?? 'active'}
                    </span>
                  </td>
                  <td>{doc.uploadedBy ?? 'N/A'}</td>
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

export default Sharing;

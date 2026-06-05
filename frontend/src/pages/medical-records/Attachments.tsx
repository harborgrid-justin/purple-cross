/**
 * WF-COMP-XXX | Attachments.tsx - Attachments
 * Purpose: React component for Attachments functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import '../../styles/Page.css';

interface AttachmentDoc {
  id: string;
  title?: string;
  fileName?: string;
  fileUrl?: string;
  category?: string;
  mimeType?: string;
  fileSize?: number;
  uploadedAt?: string;
}

const formatSize = (bytes?: number): string => {
  if (!bytes && bytes !== 0) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Attachments = () => {
  const [entityId, setEntityId] = useState('');
  const { data, isLoading, isError } = useDocuments({
    limit: 50,
    entityType: 'medical-record',
    entityId: entityId || undefined,
  });

  const documents = (data as { data?: AttachmentDoc[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Attachments</h1>
        <p className="page-subtitle">Files attached to medical records</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="attachments-entity-filter" className="sr-only">
          Filter attachments by record ID
        </label>
        <input
          id="attachments-entity-filter"
          type="search"
          placeholder="Filter by medical record ID..."
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          aria-label="Filter attachments by record ID"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading attachments...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load attachments. Please try again.</p>
          </div>
        ) : documents.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No attachments found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Attachments">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">File</th>
                <th scope="col">Category</th>
                <th scope="col">Type</th>
                <th scope="col">Size</th>
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
                  <td>{doc.mimeType ?? 'N/A'}</td>
                  <td>{formatSize(doc.fileSize)}</td>
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
                        aria-label={`Download ${doc.title ?? doc.fileName ?? 'attachment'}`}
                      >
                        Download
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

export default Attachments;

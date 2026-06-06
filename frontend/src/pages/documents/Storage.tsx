/**
 * WF-COMP-XXX | Storage.tsx - Storage
 * Purpose: React component for Storage functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import '../../styles/Page.css';

interface DocumentRow {
  id: string;
  title?: string;
  fileName?: string;
  category?: string;
  fileSize?: number;
  status?: string;
  uploadedAt?: string;
  createdAt?: string;
}

const Storage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useDocuments({ limit: 50 });

  const rows = useMemo<DocumentRow[]>(
    () => (data as { data?: DocumentRow[] } | undefined)?.data ?? [],
    [data]
  );

  const filtered = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter((doc) =>
      [doc.title, doc.fileName, doc.category].some((v) => v?.toLowerCase().includes(term))
    );
  }, [rows, search]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Storage</h1>
        <p className="page-subtitle">Browse all stored documents</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="storage-search" className="sr-only">
          Search stored documents
        </label>
        <input
          id="storage-search"
          type="search"
          placeholder="Filter by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Filter stored documents"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading documents...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load documents. Please try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No documents found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Stored documents list">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Size</th>
                <th scope="col">Uploaded</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <th scope="row">{doc.title || doc.fileName || 'Untitled'}</th>
                  <td>{doc.category || 'N/A'}</td>
                  <td>{doc.fileSize != null ? `${doc.fileSize} bytes` : 'N/A'}</td>
                  <td>
                    {doc.uploadedAt || doc.createdAt ? (
                      <time dateTime={(doc.uploadedAt || doc.createdAt) as string}>
                        {new Date((doc.uploadedAt || doc.createdAt) as string).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="btn-action"
                      aria-label={`View ${doc.title || doc.fileName || 'document'}`}
                    >
                      View
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

export default Storage;

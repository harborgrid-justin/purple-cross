/**
 * WF-COMP-XXX | Scanning.tsx - Scanning
 * Purpose: React component for Scanning functionality
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
  fileType?: string;
  mimeType?: string;
  category?: string;
  createdAt?: string;
  uploadedAt?: string;
}

const Scanning: React.FC = () => {
  const [category, setCategory] = useState('');
  const { data, isLoading, isError } = useDocuments({ limit: 50 });

  const rows = (data as { data?: DocumentRow[] } | undefined)?.data ?? [];

  const categories = useMemo(
    () => Array.from(new Set(rows.map((d) => d.category).filter(Boolean))) as string[],
    [rows]
  );

  const filtered = useMemo(
    () => (category ? rows.filter((d) => d.category === category) : rows),
    [rows, category]
  );

  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Scanning</h1>
        <p className="page-subtitle">Review scanned and digitized documents by category</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="scanning-category" className="sr-only">
          Filter by category
        </label>
        <select
          id="scanning-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter scanned documents by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading scanned documents...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load documents. Please try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No scanned documents found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Scanned documents list">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Category</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <th scope="row">{doc.title || doc.fileName || 'Untitled'}</th>
                  <td>{doc.mimeType || doc.fileType || 'N/A'}</td>
                  <td>{doc.category || 'N/A'}</td>
                  <td>
                    {doc.uploadedAt || doc.createdAt ? (
                      <time dateTime={(doc.uploadedAt || doc.createdAt) as string}>
                        {new Date(
                          (doc.uploadedAt || doc.createdAt) as string
                        ).toLocaleDateString()}
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

export default Scanning;

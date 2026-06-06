/**
 * WF-COMP-XXX | SearchRetrieval.tsx - Search Retrieval
 * Purpose: React component for SearchRetrieval functionality
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
  description?: string;
  status?: string;
}

const SearchRetrieval: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useDocuments({ limit: 50 });

  const rows = useMemo<DocumentRow[]>(
    () => (data as { data?: DocumentRow[] } | undefined)?.data ?? [],
    [data]
  );

  const results = useMemo(() => {
    if (!search) return [];
    const term = search.toLowerCase();
    return rows.filter((doc) =>
      [doc.title, doc.fileName, doc.category, doc.description].some((v) =>
        v?.toLowerCase().includes(term)
      )
    );
  }, [rows, search]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Search &amp; Retrieval</h1>
        <p className="page-subtitle">Search across all documents and metadata</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="document-fulltext-search" className="sr-only">
          Search documents
        </label>
        <input
          id="document-fulltext-search"
          type="search"
          placeholder="Search documents by name, category, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search documents"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading document index...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load documents. Please try again.</p>
          </div>
        ) : !search ? (
          <div role="status" aria-live="polite">
            <p>Enter a search term above to find documents.</p>
          </div>
        ) : results.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No documents match &ldquo;{search}&rdquo;.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Search results">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((doc) => (
                <tr key={doc.id}>
                  <th scope="row">{doc.title || doc.fileName || 'Untitled'}</th>
                  <td>{doc.category || 'N/A'}</td>
                  <td>{doc.description || 'N/A'}</td>
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

export default SearchRetrieval;

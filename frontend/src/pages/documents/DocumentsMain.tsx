/**
 * WF-COMP-DOCUMENTS-007 | DocumentsMain.tsx - Main documents page
 * Purpose: Main documents list and navigation page
 * Related: DocumentsList component, documents routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import { useMemo, useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import '../../styles/Page.css';

// Lazy load subfeature pages
const Storage = lazy(() => import('./Storage'));
const Templates = lazy(() => import('./Templates'));
const ESignature = lazy(() => import('./ESignature'));
const Scanning = lazy(() => import('./Scanning'));
const Workflow = lazy(() => import('./Workflow'));
const SearchRetrieval = lazy(() => import('./SearchRetrieval'));
const AccessControl = lazy(() => import('./AccessControl'));
const Analytics = lazy(() => import('./Analytics'));

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

const DocumentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading: loading, isError } = useDocuments({ limit: 50 });

  const documents = (data as { data?: DocumentRow[] } | undefined)?.data ?? [];

  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents;
    const term = searchTerm.toLowerCase();
    return documents.filter((doc) =>
      [doc.title, doc.fileName, doc.category].some((v) => v?.toLowerCase().includes(term))
    );
  }, [searchTerm, documents]);

  return (
    <div className="table-container">
      <div className="search-bar" role="search">
        <label htmlFor="document-search" className="sr-only">
          Search documents
        </label>
        <input
          id="document-search"
          type="search"
          placeholder="Search documents by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search documents by name or category"
        />
      </div>
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading documents...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load documents. Please try again.</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No documents found.</p>
        </div>
      ) : (
        <table className="data-table" role="table" aria-label="Documents list">
          <thead>
            <tr>
              <th scope="col">Document Name</th>
              <th scope="col">Type</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => {
              const name = doc.title || doc.fileName || 'Untitled';
              const date = doc.uploadedAt || doc.createdAt;
              return (
                <tr key={doc.id}>
                  <th scope="row">{name}</th>
                  <td>{doc.mimeType || doc.fileType || 'N/A'}</td>
                  <td>{doc.category || 'N/A'}</td>
                  <td>
                    {date ? (
                      <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="btn-action"
                      aria-label={`View ${name}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const DocumentsMain = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📄</span> Documents
        </h1>
        <button className="btn-primary" aria-label="Upload new document">
          + Upload Document
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Documents sections">
        <Link
          to="/documents"
          className={`sub-nav-link ${location.pathname === '/documents' ? 'active' : ''}`}
        >
          All Documents
        </Link>
        <Link
          to="/documents/storage"
          className={`sub-nav-link ${location.pathname.includes('/storage') ? 'active' : ''}`}
        >
          Document Storage
        </Link>
        <Link
          to="/documents/templates"
          className={`sub-nav-link ${location.pathname.includes('/templates') ? 'active' : ''}`}
        >
          Templates
        </Link>
        <Link
          to="/documents/e-signature"
          className={`sub-nav-link ${location.pathname.includes('/e-signature') ? 'active' : ''}`}
        >
          E-Signature
        </Link>
        <Link
          to="/documents/scanning"
          className={`sub-nav-link ${location.pathname.includes('/scanning') ? 'active' : ''}`}
        >
          Document Scanning
        </Link>
        <Link
          to="/documents/workflow"
          className={`sub-nav-link ${location.pathname.includes('/workflow') ? 'active' : ''}`}
        >
          Workflow
        </Link>
        <Link
          to="/documents/search"
          className={`sub-nav-link ${location.pathname.includes('/search') ? 'active' : ''}`}
        >
          Search & Retrieval
        </Link>
        <Link
          to="/documents/access-control"
          className={`sub-nav-link ${location.pathname.includes('/access-control') ? 'active' : ''}`}
        >
          Access Control
        </Link>
        <Link
          to="/documents/analytics"
          className={`sub-nav-link ${location.pathname.includes('/analytics') ? 'active' : ''}`}
        >
          Analytics
        </Link>
      </nav>

      <Suspense
        fallback={
          <div role="status">
            <p>Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<DocumentsList />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/e-signature" element={<ESignature />} />
          <Route path="/scanning" element={<Scanning />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/search" element={<SearchRetrieval />} />
          <Route path="/access-control" element={<AccessControl />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default DocumentsMain;

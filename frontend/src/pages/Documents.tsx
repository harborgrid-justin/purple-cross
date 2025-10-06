import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import '../styles/Page.css';

// Lazy load subfeature pages
const Storage = lazy(() => import('./documents/Storage'));
const Templates = lazy(() => import('./documents/Templates'));
const ESignature = lazy(() => import('./documents/ESignature'));
const Scanning = lazy(() => import('./documents/Scanning'));
const Workflow = lazy(() => import('./documents/Workflow'));
const SearchRetrieval = lazy(() => import('./documents/SearchRetrieval'));
const AccessControl = lazy(() => import('./documents/AccessControl'));
const Analytics = lazy(() => import('./documents/Analytics'));

const DocumentsList = () => {
  const [documents] = useState([
    { id: '1', name: 'Consent Form - Max', type: 'Form', date: '2024-01-15', status: 'Signed' },
    {
      id: '2',
      name: 'Treatment Plan - Luna',
      type: 'Report',
      date: '2024-01-14',
      status: 'Pending',
    },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Documents list">
        <thead>
          <tr>
            <th scope="col">Document Name</th>
            <th scope="col">Type</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <th scope="row">{doc.name}</th>
              <td>{doc.type}</td>
              <td>{doc.date}</td>
              <td>
                <span
                  className={`status-badge status-${doc.status === 'Signed' ? 'confirmed' : 'pending'}`}
                >
                  {doc.status}
                </span>
              </td>
              <td>
                <button className="btn-action" aria-label={`View ${doc.name}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Download ${doc.name}`}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Documents = () => {
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

export default Documents;

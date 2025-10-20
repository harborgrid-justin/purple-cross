import { useState, useEffect, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import api from '../services/api';
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

interface Document {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  patient?: { id: string; name: string };
}

const DocumentsList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = (await api.documents.getAll({
          limit: 50,
        })) as { status: string; data: Document[] };
        setDocuments(response.data);
        setFilteredDocuments(response.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setDocuments([]);
        setFilteredDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter((doc) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        doc.name.toLowerCase().includes(searchLower) ||
        doc.type.toLowerCase().includes(searchLower) ||
        (doc.patient && doc.patient.name.toLowerCase().includes(searchLower))
      );
    });
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  return (
    <div className="table-container">
      <div className="search-container" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          id="document-search"
          placeholder="Search documents by name, type, or patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading documents...</p>
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
            <th scope="col">Patient</th>
            <th scope="col">Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <th scope="row">{doc.name}</th>
              <td>{doc.type}</td>
              <td>{doc.patient ? doc.patient.name : 'N/A'}</td>
              <td>
                <time dateTime={doc.createdAt}>
                  {new Date(doc.createdAt).toLocaleDateString()}
                </time>
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
      )}
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

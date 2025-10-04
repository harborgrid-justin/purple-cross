import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Documents = () => {
  const [documents] = useState([
    { id: '1', name: 'Consent Form - Max', type: 'Form', date: '2024-01-15', status: 'Signed' },
    { id: '2', name: 'Treatment Plan - Luna', type: 'Report', date: '2024-01-14', status: 'Pending' },
  ]);

  return (
    <div className="page">
      <header className="page-header">
        <h1><span aria-hidden="true">📄</span> Documents</h1>
        <button className="btn-primary" aria-label="Upload new document">
          + Upload Document
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Documents sections">
        <Link to="/documents" className="sub-nav-link active">All Documents</Link>
        <Link to="/documents/storage" className="sub-nav-link">Document Storage</Link>
        <Link to="/documents/templates" className="sub-nav-link">Templates</Link>
        <Link to="/documents/e-signature" className="sub-nav-link">E-Signature</Link>
        <Link to="/documents/scanning" className="sub-nav-link">Document Scanning</Link>
        <Link to="/documents/workflow" className="sub-nav-link">Workflow</Link>
        <Link to="/documents/search" className="sub-nav-link">Search & Retrieval</Link>
        <Link to="/documents/access-control" className="sub-nav-link">Access Control</Link>
        <Link to="/documents/analytics" className="sub-nav-link">Analytics</Link>
      </nav>

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
                  <span className={`status-badge status-${doc.status === 'Signed' ? 'confirmed' : 'pending'}`}>
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
    </div>
  );
};

export default Documents;

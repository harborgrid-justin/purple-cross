import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useDocuments } from '../../frontend/src/hooks/useDocuments';
import '../styles/Module.css';

const DocumentManagement: React.FC = () => {
  const { data, isLoading, error } = useDocuments();

  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Document Management</h1>
              <button className="btn-primary">Upload Document</button>
            </div>

            <div className="module-nav">
              <Link to="/documents" className="tab-link active">Document Storage</Link>
              <Link to="/documents/templates" className="tab-link">Templates</Link>
              <Link to="/documents/e-signature" className="tab-link">E-Signature</Link>
              <Link to="/documents/scanning" className="tab-link">Scanning</Link>
              <Link to="/documents/workflow" className="tab-link">Workflow</Link>
              <Link to="/documents/search" className="tab-link">Search</Link>
              <Link to="/documents/access" className="tab-link">Access Control</Link>
              <Link to="/documents/analytics" className="tab-link">Analytics</Link>
            </div>

            <div className="content-section">
              {isLoading && <div className="loading">Loading documents...</div>}
              {error && <div className="error">Error loading documents: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && data.data && data.data.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Type</th>
                        <th>Entity</th>
                        <th>Upload Date</th>
                        <th>Size</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((doc: any) => (
                        <tr key={doc.id}>
                          <td>{doc.fileName || doc.name}</td>
                          <td>{doc.documentType || doc.type}</td>
                          <td>{doc.entityType} - {doc.entityId}</td>
                          <td>{new Date(doc.uploadDate || doc.createdAt).toLocaleDateString()}</td>
                          <td>{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : 'N/A'}</td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="info-cards">
                  <div className="info-card">
                    <h3>Document Repository</h3>
                    <p>Centralized document management</p>
                    <ul>
                      <li>Cloud storage</li>
                      <li>Full-text search</li>
                      <li>Version control</li>
                      <li>Access permissions</li>
                    </ul>
                  </div>
                  <div className="info-card">
                    <h3>Automation</h3>
                    <p>Streamlined document workflows</p>
                    <ul>
                      <li>Document templates</li>
                      <li>E-signature integration</li>
                      <li>OCR scanning</li>
                      <li>Approval workflows</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default DocumentManagement;

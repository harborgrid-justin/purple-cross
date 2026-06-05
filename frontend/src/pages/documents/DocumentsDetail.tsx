/**
 * WF-COMP-DOCUMENTS-004 | DocumentsDetail.tsx - Documents detail page
 * Purpose: Display detailed information for a single documents
 * Related: Documents details component, documents store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocuments';
import '../../styles/Page.css';

interface DocumentDetail {
  id: string;
  title?: string;
  fileName?: string;
  fileType?: string;
  mimeType?: string;
  fileSize?: number;
  category?: string;
  description?: string;
  status?: string;
  uploadedAt?: string;
  createdAt?: string;
}

const DocumentsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useDocument(id || '');

  const document = (data as { data?: DocumentDetail } | undefined)?.data;

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📄</span> Document Details
        </h1>
        <div>
          <Link to={`/documents/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/documents" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading document...</p>
        </div>
      ) : isError || !document ? (
        <div className="alert alert-warning" role="alert">
          <p>Document not found.</p>
        </div>
      ) : (
        <div className="content-section">
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Title / File Name</dt>
              <dd>{document.title || document.fileName || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Type</dt>
              <dd>{document.mimeType || document.fileType || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Size</dt>
              <dd>{document.fileSize != null ? `${document.fileSize} bytes` : 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Category</dt>
              <dd>{document.category || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Description</dt>
              <dd>{document.description || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Status</dt>
              <dd>
                <span className="status-badge status-confirmed">{document.status || 'N/A'}</span>
              </dd>
            </div>
            <div className="detail-row">
              <dt>Uploaded</dt>
              <dd>
                {document.uploadedAt || document.createdAt
                  ? new Date(
                      (document.uploadedAt || document.createdAt) as string
                    ).toLocaleString()
                  : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default DocumentsDetail;

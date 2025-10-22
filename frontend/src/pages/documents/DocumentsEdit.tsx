/**
 * WF-COMP-DOCUMENTS-006 | DocumentsEdit.tsx - Edit documents page
 * Purpose: Form page for editing existing documents
 * Related: Documents form component, documents store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const DocumentsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📄</span> Edit Documents
        </h1>
        <Link to={`/documents/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for documents ID: {id}</p>
      </div>
    </div>
  );
};

export default DocumentsEdit;

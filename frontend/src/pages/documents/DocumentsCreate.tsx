/**
 * WF-COMP-DOCUMENTS-005 | DocumentsCreate.tsx - Create documents page
 * Purpose: Form page for creating new documents
 * Related: Documents form component, documents store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const DocumentsCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📄</span> Create New Documents
        </h1>
        <Link to="/documents" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new documents</p>
      </div>
    </div>
  );
};

export default DocumentsCreate;

/**
 * WF-COMP-COMMUNICATIONS-006 | CommunicationsEdit.tsx - Edit communications page
 * Purpose: Form page for editing existing communications
 * Related: Communications form component, communications store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const CommunicationsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📧</span> Edit Communications
        </h1>
        <Link to={`/communications/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for communications ID: {id}</p>
      </div>
    </div>
  );
};

export default CommunicationsEdit;

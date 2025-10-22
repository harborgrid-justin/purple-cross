/**
 * WF-COMP-COMMUNICATIONS-005 | CommunicationsCreate.tsx - Create communications page
 * Purpose: Form page for creating new communications
 * Related: Communications form component, communications store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const CommunicationsCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📧</span> Create New Communications
        </h1>
        <Link to="/communications" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new communications</p>
      </div>
    </div>
  );
};

export default CommunicationsCreate;

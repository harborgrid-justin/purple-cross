/**
 * WF-COMP-LABORATORY-005 | LaboratoryCreate.tsx - Create laboratory page
 * Purpose: Form page for creating new laboratory
 * Related: Laboratory form component, laboratory store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const LaboratoryCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔬</span> Create New Laboratory
        </h1>
        <Link to="/laboratory" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new laboratory</p>
      </div>
    </div>
  );
};

export default LaboratoryCreate;

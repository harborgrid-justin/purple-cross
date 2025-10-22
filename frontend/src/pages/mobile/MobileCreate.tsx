/**
 * WF-COMP-MOBILE-005 | MobileCreate.tsx - Create mobile page
 * Purpose: Form page for creating new mobile
 * Related: Mobile form component, mobile store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const MobileCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📱</span> Create New Mobile
        </h1>
        <Link to="/mobile" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new mobile</p>
      </div>
    </div>
  );
};

export default MobileCreate;

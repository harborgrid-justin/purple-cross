/**
 * WF-COMP-MOBILE-006 | MobileEdit.tsx - Edit mobile page
 * Purpose: Form page for editing existing mobile
 * Related: Mobile form component, mobile store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const MobileEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📱</span> Edit Mobile
        </h1>
        <Link to={`/mobile/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for mobile ID: {id}</p>
      </div>
    </div>
  );
};

export default MobileEdit;

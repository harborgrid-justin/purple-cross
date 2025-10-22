/**
 * WF-COMP-LABORATORY-006 | LaboratoryEdit.tsx - Edit laboratory page
 * Purpose: Form page for editing existing laboratory
 * Related: Laboratory form component, laboratory store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const LaboratoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔬</span> Edit Laboratory
        </h1>
        <Link to={`/laboratory/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for laboratory ID: {id}</p>
      </div>
    </div>
  );
};

export default LaboratoryEdit;

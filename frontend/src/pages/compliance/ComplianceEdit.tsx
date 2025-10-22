/**
 * WF-COMP-COMPLIANCE-006 | ComplianceEdit.tsx - Edit compliance page
 * Purpose: Form page for editing existing compliance
 * Related: Compliance form component, compliance store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const ComplianceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✅</span> Edit Compliance
        </h1>
        <Link to={`/compliance/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for compliance ID: {id}</p>
      </div>
    </div>
  );
};

export default ComplianceEdit;

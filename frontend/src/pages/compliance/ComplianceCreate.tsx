/**
 * WF-COMP-COMPLIANCE-005 | ComplianceCreate.tsx - Create compliance page
 * Purpose: Form page for creating new compliance
 * Related: Compliance form component, compliance store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const ComplianceCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✅</span> Create New Compliance
        </h1>
        <Link to="/compliance" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new compliance</p>
      </div>
    </div>
  );
};

export default ComplianceCreate;

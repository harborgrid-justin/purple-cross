/**
 * WF-COMP-COMPLIANCE-004 | ComplianceDetail.tsx - Compliance detail page
 * Purpose: Display detailed information for a single compliance
 * Related: Compliance details component, compliance store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const ComplianceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✅</span> Compliance Details
        </h1>
        <div>
          <Link to={`/compliance/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/compliance" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <p>Detail view for compliance ID: {id}</p>
      </div>
    </div>
  );
};

export default ComplianceDetail;

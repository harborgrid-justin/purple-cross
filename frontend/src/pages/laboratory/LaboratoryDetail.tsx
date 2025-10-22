/**
 * WF-COMP-LABORATORY-004 | LaboratoryDetail.tsx - Laboratory detail page
 * Purpose: Display detailed information for a single laboratory
 * Related: Laboratory details component, laboratory store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const LaboratoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔬</span> Laboratory Details
        </h1>
        <div>
          <Link to={`/laboratory/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/laboratory" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <p>Detail view for laboratory ID: {id}</p>
      </div>
    </div>
  );
};

export default LaboratoryDetail;

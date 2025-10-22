/**
 * WF-COMP-PRESCRIPTIONS-004 | PrescriptionsDetail.tsx - Prescriptions detail page
 * Purpose: Display detailed information for a single prescriptions
 * Related: Prescriptions details component, prescriptions store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const PrescriptionsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">💊</span> Prescriptions Details
        </h1>
        <div>
          <Link to={`/prescriptions/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/prescriptions" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <p>Detail view for prescriptions ID: {id}</p>
      </div>
    </div>
  );
};

export default PrescriptionsDetail;

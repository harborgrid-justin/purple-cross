/**
 * WF-COMP-REPORTS-004 | ReportsDetail.tsx - Reports detail page
 * Purpose: Display detailed information for a single reports
 * Related: Reports details component, reports store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const ReportsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📊</span> Reports Details
        </h1>
        <div>
          <Link to={`/reports/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/reports" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <p>Detail view for reports ID: {id}</p>
      </div>
    </div>
  );
};

export default ReportsDetail;

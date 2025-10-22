/**
 * WF-COMP-REPORTS-006 | ReportsEdit.tsx - Edit reports page
 * Purpose: Form page for editing existing reports
 * Related: Reports form component, reports store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const ReportsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📊</span> Edit Reports
        </h1>
        <Link to={`/reports/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for reports ID: {id}</p>
      </div>
    </div>
  );
};

export default ReportsEdit;

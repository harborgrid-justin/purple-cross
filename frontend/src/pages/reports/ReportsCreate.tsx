/**
 * WF-COMP-REPORTS-005 | ReportsCreate.tsx - Create reports page
 * Purpose: Form page for creating new reports
 * Related: Reports form component, reports store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const ReportsCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📊</span> Create New Reports
        </h1>
        <Link to="/reports" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new reports</p>
      </div>
    </div>
  );
};

export default ReportsCreate;

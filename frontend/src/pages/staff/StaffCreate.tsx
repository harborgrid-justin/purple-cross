/**
 * WF-COMP-STAFF-005 | StaffCreate.tsx - Create staff page
 * Purpose: Form page for creating new staff
 * Related: Staff form component, staff store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const StaffCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👨‍⚕️</span> Create New Staff
        </h1>
        <Link to="/staff" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new staff</p>
      </div>
    </div>
  );
};

export default StaffCreate;

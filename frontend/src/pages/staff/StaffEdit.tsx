/**
 * WF-COMP-STAFF-006 | StaffEdit.tsx - Edit staff page
 * Purpose: Form page for editing existing staff
 * Related: Staff form component, staff store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const StaffEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👨‍⚕️</span> Edit Staff
        </h1>
        <Link to={`/staff/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for staff ID: {id}</p>
      </div>
    </div>
  );
};

export default StaffEdit;

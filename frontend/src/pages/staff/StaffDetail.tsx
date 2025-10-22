/**
 * WF-COMP-STAFF-004 | StaffDetail.tsx - Staff detail page
 * Purpose: Display detailed information for a single staff
 * Related: Staff details component, staff store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👨‍⚕️</span> Staff Details
        </h1>
        <div>
          <Link to={`/staff/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/staff" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <p>Detail view for staff ID: {id}</p>
      </div>
    </div>
  );
};

export default StaffDetail;

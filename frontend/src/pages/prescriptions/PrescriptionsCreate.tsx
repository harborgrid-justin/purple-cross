/**
 * WF-COMP-PRESCRIPTIONS-005 | PrescriptionsCreate.tsx - Create prescriptions page
 * Purpose: Form page for creating new prescriptions
 * Related: Prescriptions form component, prescriptions store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const PrescriptionsCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">💊</span> Create New Prescriptions
        </h1>
        <Link to="/prescriptions" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new prescriptions</p>
      </div>
    </div>
  );
};

export default PrescriptionsCreate;

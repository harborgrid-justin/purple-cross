/**
 * WF-COMP-MEDICALRECORDS-005 | MedicalRecordsCreate.tsx - Create medical records page
 * Purpose: Form page for creating new medical records
 * Related: MedicalRecords form component, medical-records store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const MedicalRecordsCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📋</span> Create New MedicalRecords
        </h1>
        <Link to="/medical-records" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new medical records</p>
      </div>
    </div>
  );
};

export default MedicalRecordsCreate;

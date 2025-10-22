/**
 * WF-COMP-MEDICALRECORDS-006 | MedicalRecordsEdit.tsx - Edit medical records page
 * Purpose: Form page for editing existing medical records
 * Related: MedicalRecords form component, medical-records store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const MedicalRecordsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📋</span> Edit MedicalRecords
        </h1>
        <Link to={`/medical-records/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for medical records ID: {id}</p>
      </div>
    </div>
  );
};

export default MedicalRecordsEdit;

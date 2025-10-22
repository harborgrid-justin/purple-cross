/**
 * WF-COMP-MEDICALRECORDS-004 | MedicalRecordsDetail.tsx - MedicalRecords detail page
 * Purpose: Display detailed information for a single medical records
 * Related: MedicalRecords details component, medical-records store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const MedicalRecordsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📋</span> MedicalRecords Details
        </h1>
        <div>
          <Link to={`/medical-records/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/medical-records" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <p>Detail view for medical records ID: {id}</p>
      </div>
    </div>
  );
};

export default MedicalRecordsDetail;

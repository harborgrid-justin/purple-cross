/**
 * WF-COMP-MEDICALRECORDS-004 | MedicalRecordsDetail.tsx - MedicalRecords detail page
 * Purpose: Display detailed information for a single medical records
 * Related: MedicalRecords details component, medical-records store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMedicalRecord } from '../../hooks/useMedicalRecords';
import '../../styles/Page.css';

interface MedicalRecordDetail {
  id: string;
  visitDate?: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  patient?: { id: string; name: string };
  veterinarian?: { id: string; firstName: string; lastName: string };
  createdAt?: string;
  updatedAt?: string;
}

const MedicalRecordsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useMedicalRecord(id || '');
  const record = (data as { data?: MedicalRecordDetail } | undefined)?.data;

  if (isLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading medical record...</p>
        </div>
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Medical record not found</p>
        </div>
        <Link to="/medical-records" className="btn-secondary">
          Back to Medical Records
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📋</span> Medical Record
        </h1>
        <div>
          <Link to={`/medical-records/${record.id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/medical-records" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <div className="detail-grid">
          <div className="detail-section">
            <h2>Visit Information</h2>
            <dl>
              <dt>Visit Date:</dt>
              <dd>
                {record.visitDate ? new Date(record.visitDate).toLocaleDateString() : 'N/A'}
              </dd>
              <dt>Chief Complaint:</dt>
              <dd>{record.chiefComplaint || 'N/A'}</dd>
              <dt>Diagnosis:</dt>
              <dd>{record.diagnosis || 'N/A'}</dd>
              <dt>Treatment:</dt>
              <dd>{record.treatment || 'N/A'}</dd>
              <dt>Notes:</dt>
              <dd>{record.notes || 'N/A'}</dd>
            </dl>
          </div>

          <div className="detail-section">
            <h2>Patient &amp; Clinician</h2>
            <dl>
              <dt>Patient:</dt>
              <dd>{record.patient?.name ?? 'Unknown'}</dd>
              <dt>Veterinarian:</dt>
              <dd>
                {record.veterinarian
                  ? `Dr. ${record.veterinarian.firstName} ${record.veterinarian.lastName}`
                  : 'Unassigned'}
              </dd>
            </dl>
          </div>

          <div className="detail-section">
            <h2>Record Information</h2>
            <dl>
              {record.createdAt && (
                <>
                  <dt>Created:</dt>
                  <dd>{new Date(record.createdAt).toLocaleDateString()}</dd>
                </>
              )}
              {record.updatedAt && (
                <>
                  <dt>Last Updated:</dt>
                  <dd>{new Date(record.updatedAt).toLocaleDateString()}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsDetail;

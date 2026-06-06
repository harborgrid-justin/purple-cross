/**
 * WF-COMP-PRESCRIPTIONS-004 | PrescriptionsDetail.tsx - Prescriptions detail page
 * Purpose: Display detailed information for a single prescription
 * Related: usePrescription, prescriptions routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePrescription } from '../../hooks/usePrescriptions';
import '../../styles/Page.css';

interface PrescriptionDetailData {
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  refills?: number;
  status?: string;
  prescriptionDate?: string;
  patient?: { name: string };
  medication?: { name: string };
}

const PrescriptionsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: loading, isError } = usePrescription(id || '');
  const rx = (data as { data?: PrescriptionDetailData } | undefined)?.data;

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">💊</span> Prescription Details
        </h1>
        <div>
          <Link to={`/prescriptions/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/prescriptions" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading prescription...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load prescription. Please try again.</p>
        </div>
      ) : !rx ? (
        <div className="alert alert-warning" role="alert">
          <p>Prescription not found.</p>
        </div>
      ) : (
        <div className="content-section">
          <dl className="detail-list">
            <dt>Patient</dt>
            <dd>{rx.patient?.name ?? 'Unknown'}</dd>
            <dt>Medication</dt>
            <dd>{rx.medication?.name ?? 'N/A'}</dd>
            <dt>Status</dt>
            <dd>
              <span
                className={`status-badge status-${rx.status ?? 'pending'}`}
                role="status"
                aria-label={`Status: ${rx.status ?? 'unknown'}`}
              >
                {rx.status ?? 'N/A'}
              </span>
            </dd>
            <dt>Prescription Date</dt>
            <dd>
              {rx.prescriptionDate ? new Date(rx.prescriptionDate).toLocaleDateString() : 'N/A'}
            </dd>
            <dt>Dosage</dt>
            <dd>{rx.dosage ?? 'N/A'}</dd>
            <dt>Frequency</dt>
            <dd>{rx.frequency ?? 'N/A'}</dd>
            <dt>Duration</dt>
            <dd>{rx.duration ?? 'N/A'}</dd>
            <dt>Refills</dt>
            <dd>{rx.refills ?? 0}</dd>
            <dt>Instructions</dt>
            <dd>{rx.instructions ?? '—'}</dd>
          </dl>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsDetail;

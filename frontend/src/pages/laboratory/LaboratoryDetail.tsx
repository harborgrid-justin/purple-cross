/**
 * WF-COMP-LABORATORY-004 | LaboratoryDetail.tsx - Laboratory detail page
 * Purpose: Display detailed information for a single laboratory
 * Related: Laboratory details component, laboratory store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLabTest } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface LabTestDetail {
  id: string;
  testName?: string;
  testType?: string;
  labType?: string;
  externalLabName?: string;
  status?: string;
  urgency?: string;
  sampleId?: string;
  orderedDate?: string;
  collectionDate?: string;
  receivedDate?: string;
  completedDate?: string;
  interpretation?: string;
  notes?: string;
  patient?: { id: string; name: string };
}

const fmtDate = (value?: string): string => (value ? new Date(value).toLocaleDateString() : 'N/A');

const LaboratoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useLabTest(id || '');
  const test = (data as { data?: LabTestDetail } | undefined)?.data;

  if (isLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading lab test...</p>
        </div>
      </div>
    );
  }

  if (isError || !test) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Lab test not found</p>
        </div>
        <Link to="/laboratory" className="btn-secondary">
          Back to Laboratory
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔬</span> {test.testName ?? 'Lab Test'}
        </h1>
        <div>
          <Link to={`/laboratory/${test.id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/laboratory" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <div className="detail-grid">
          <div className="detail-section">
            <h2>Test Information</h2>
            <dl>
              <dt>Test Name:</dt>
              <dd>{test.testName ?? 'N/A'}</dd>
              <dt>Test Type:</dt>
              <dd>{test.testType ?? 'N/A'}</dd>
              <dt>Lab Type:</dt>
              <dd>{test.labType ?? 'N/A'}</dd>
              {test.externalLabName && (
                <>
                  <dt>External Lab:</dt>
                  <dd>{test.externalLabName}</dd>
                </>
              )}
              <dt>Status:</dt>
              <dd>{test.status ?? 'N/A'}</dd>
              <dt>Urgency:</dt>
              <dd>{test.urgency ?? 'N/A'}</dd>
            </dl>
          </div>

          <div className="detail-section">
            <h2>Sample &amp; Timeline</h2>
            <dl>
              <dt>Patient:</dt>
              <dd>{test.patient?.name ?? 'Unknown'}</dd>
              <dt>Sample ID:</dt>
              <dd>{test.sampleId ?? 'N/A'}</dd>
              <dt>Ordered:</dt>
              <dd>{fmtDate(test.orderedDate)}</dd>
              <dt>Collected:</dt>
              <dd>{fmtDate(test.collectionDate)}</dd>
              <dt>Received:</dt>
              <dd>{fmtDate(test.receivedDate)}</dd>
              <dt>Completed:</dt>
              <dd>{fmtDate(test.completedDate)}</dd>
            </dl>
          </div>

          <div className="detail-section">
            <h2>Results</h2>
            <dl>
              <dt>Interpretation:</dt>
              <dd>{test.interpretation ?? 'Pending'}</dd>
              <dt>Notes:</dt>
              <dd>{test.notes ?? 'None'}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryDetail;

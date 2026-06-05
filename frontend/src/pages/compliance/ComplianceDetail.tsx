/**
 * WF-COMP-COMPLIANCE-004 | ComplianceDetail.tsx - Compliance detail page
 * Purpose: Display detailed information for a single compliance
 * Related: Compliance details component, compliance store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolicy } from '../../hooks/usePolicies';
import '../../styles/Page.css';

interface PolicyDetail {
  id: string;
  title?: string;
  category?: string;
  content?: string;
  version?: string;
  status?: string;
  effectiveDate?: string;
  reviewDate?: string;
}

const ComplianceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = usePolicy(id || '');

  const policy = (data as { data?: PolicyDetail } | undefined)?.data;

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✅</span> Compliance Details
        </h1>
        <div>
          <Link to={`/compliance/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/compliance" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading policy...</p>
        </div>
      ) : isError || !policy ? (
        <div className="alert alert-warning" role="alert">
          <p>Policy not found.</p>
        </div>
      ) : (
        <div className="content-section">
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Title</dt>
              <dd>{policy.title || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Category</dt>
              <dd>{policy.category || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Version</dt>
              <dd>{policy.version || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Status</dt>
              <dd>
                <span className="status-badge status-confirmed">{policy.status || 'N/A'}</span>
              </dd>
            </div>
            <div className="detail-row">
              <dt>Effective Date</dt>
              <dd>
                {policy.effectiveDate
                  ? new Date(policy.effectiveDate).toLocaleDateString()
                  : 'N/A'}
              </dd>
            </div>
            <div className="detail-row">
              <dt>Review Date</dt>
              <dd>
                {policy.reviewDate ? new Date(policy.reviewDate).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            <div className="detail-row">
              <dt>Content</dt>
              <dd>{policy.content || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default ComplianceDetail;

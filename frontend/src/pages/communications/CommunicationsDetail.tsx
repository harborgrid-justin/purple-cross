/**
 * WF-COMP-COMMUNICATIONS-004 | CommunicationsDetail.tsx - Communications detail page
 * Purpose: Display detailed information for a single communications
 * Related: Communications details component, communications store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommunication } from '../../hooks/useCommunications';
import '../../styles/Page.css';

interface CommunicationDetail {
  id: string;
  type: string;
  direction?: string;
  subject?: string;
  message: string;
  status: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  client?: { firstName?: string; lastName?: string };
}

const CommunicationsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useCommunication(id || '');

  const communication = (data as { data?: CommunicationDetail } | undefined)?.data;

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📧</span> Communication Details
        </h1>
        <div>
          <Link to={`/communications/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/communications" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading communication...</p>
        </div>
      ) : isError || !communication ? (
        <div className="alert alert-warning" role="alert">
          <p>Communication not found.</p>
        </div>
      ) : (
        <div className="content-section">
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Type</dt>
              <dd>{communication.type}</dd>
            </div>
            <div className="detail-row">
              <dt>Direction</dt>
              <dd>{communication.direction || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Subject</dt>
              <dd>{communication.subject || 'N/A'}</dd>
            </div>
            <div className="detail-row">
              <dt>Message</dt>
              <dd>{communication.message}</dd>
            </div>
            <div className="detail-row">
              <dt>Status</dt>
              <dd>
                <span className="status-badge status-confirmed">{communication.status}</span>
              </dd>
            </div>
            <div className="detail-row">
              <dt>Client</dt>
              <dd>
                {communication.client
                  ? `${communication.client.firstName ?? ''} ${communication.client.lastName ?? ''}`.trim()
                  : 'N/A'}
              </dd>
            </div>
            <div className="detail-row">
              <dt>Sent At</dt>
              <dd>
                {communication.sentAt ? new Date(communication.sentAt).toLocaleString() : 'N/A'}
              </dd>
            </div>
            <div className="detail-row">
              <dt>Read At</dt>
              <dd>
                {communication.readAt ? new Date(communication.readAt).toLocaleString() : 'Unread'}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default CommunicationsDetail;

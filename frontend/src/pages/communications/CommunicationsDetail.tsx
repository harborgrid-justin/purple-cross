/**
 * WF-COMP-COMMUNICATIONS-004 | CommunicationsDetail.tsx - Communications detail page
 * Purpose: Display detailed information for a single communications
 * Related: Communications details component, communications store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const CommunicationsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📧</span> Communications Details
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

      <div className="content-section">
        <p>Detail view for communications ID: {id}</p>
      </div>
    </div>
  );
};

export default CommunicationsDetail;

/**
 * WF-COMP-MOBILE-004 | MobileDetail.tsx - Mobile detail page
 * Purpose: Display detailed information for a single mobile
 * Related: Mobile details component, mobile store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const MobileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📱</span> Mobile Details
        </h1>
        <div>
          <Link to={`/mobile/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/mobile" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <p>Detail view for mobile ID: {id}</p>
      </div>
    </div>
  );
};

export default MobileDetail;

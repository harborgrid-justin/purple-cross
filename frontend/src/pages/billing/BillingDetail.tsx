/**
 * WF-COMP-BILLING-004 | BillingDetail.tsx - Billing detail page
 * Purpose: Display detailed information for a single billing
 * Related: Billing details component, billing store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const BillingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">💰</span> Billing Details
        </h1>
        <div>
          <Link to={`/billing/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/billing" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <p>Detail view for billing ID: {id}</p>
      </div>
    </div>
  );
};

export default BillingDetail;

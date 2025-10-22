/**
 * WF-COMP-BILLING-005 | BillingCreate.tsx - Create billing page
 * Purpose: Form page for creating new billing
 * Related: Billing form component, billing store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const BillingCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">💰</span> Create New Billing
        </h1>
        <Link to="/billing" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new billing</p>
      </div>
    </div>
  );
};

export default BillingCreate;

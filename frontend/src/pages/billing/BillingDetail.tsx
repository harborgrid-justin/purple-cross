/**
 * WF-COMP-BILLING-004 | BillingDetail.tsx - Billing detail page
 * Purpose: Display detailed information for a single invoice
 * Related: useInvoice, billing routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInvoice } from '../../hooks/useInvoices';
import '../../styles/Page.css';

interface InvoiceDetail {
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  status?: string;
  notes?: string;
  client?: { firstName: string; lastName: string };
}

const BillingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: loading, isError } = useInvoice(id || '');
  const invoice = (data as { data?: InvoiceDetail } | undefined)?.data;

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">💰</span> Invoice Details
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

      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading invoice...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load invoice. Please try again.</p>
        </div>
      ) : !invoice ? (
        <div className="alert alert-warning" role="alert">
          <p>Invoice not found.</p>
        </div>
      ) : (
        <div className="content-section">
          <dl className="detail-list">
            <dt>Invoice Number</dt>
            <dd>{invoice.invoiceNumber ?? 'N/A'}</dd>
            <dt>Client</dt>
            <dd>
              {invoice.client
                ? `${invoice.client.firstName} ${invoice.client.lastName}`
                : 'Unknown'}
            </dd>
            <dt>Status</dt>
            <dd>
              <span
                className={`status-badge status-${invoice.status}`}
                role="status"
                aria-label={`Status: ${invoice.status}`}
              >
                {invoice.status ?? 'N/A'}
              </span>
            </dd>
            <dt>Invoice Date</dt>
            <dd>
              {invoice.invoiceDate
                ? new Date(invoice.invoiceDate).toLocaleDateString()
                : 'N/A'}
            </dd>
            <dt>Due Date</dt>
            <dd>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</dd>
            <dt>Subtotal</dt>
            <dd>{invoice.subtotal != null ? `$${Number(invoice.subtotal).toFixed(2)}` : 'N/A'}</dd>
            <dt>Tax</dt>
            <dd>{invoice.tax != null ? `$${Number(invoice.tax).toFixed(2)}` : 'N/A'}</dd>
            <dt>Total</dt>
            <dd>{invoice.total != null ? `$${Number(invoice.total).toFixed(2)}` : 'N/A'}</dd>
            <dt>Notes</dt>
            <dd>{invoice.notes ?? '—'}</dd>
          </dl>
        </div>
      )}
    </div>
  );
};

export default BillingDetail;

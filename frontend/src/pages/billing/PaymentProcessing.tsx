/**
 * WF-COMP-XXX | PaymentProcessing.tsx - Payment Processing
 * Purpose: Work outstanding invoices that are awaiting payment
 * Dependencies: useInvoices
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../../hooks/useInvoices';
import '../../styles/Page.css';

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  total: number;
  dueDate: string;
  status: string;
  client?: { firstName: string; lastName: string };
}

const PAYABLE_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'partial', label: 'Partially Paid' },
];

const PaymentProcessing = () => {
  const [status, setStatus] = useState('pending');
  const { data, isLoading: loading, isError } = useInvoices({ status, limit: 50 });

  const invoices = (data as { data?: InvoiceRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Payment Processing</h1>
        <p className="page-subtitle">Outstanding invoices awaiting payment</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="payment-status">Filter by status</label>
        <select
          id="payment-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter invoices by payment status"
        >
          {PAYABLE_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading invoices...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load invoices. Please try again.</p>
          </div>
        ) : invoices.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No invoices found for this status.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Invoices awaiting payment">
            <thead>
              <tr>
                <th scope="col">Invoice #</th>
                <th scope="col">Client</th>
                <th scope="col">Amount Due</th>
                <th scope="col">Due Date</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <th scope="row">{invoice.invoiceNumber}</th>
                  <td>
                    {invoice.client
                      ? `${invoice.client.firstName} ${invoice.client.lastName}`
                      : 'Unknown'}
                  </td>
                  <td>${Number(invoice.total).toFixed(2)}</td>
                  <td>
                    <time dateTime={invoice.dueDate}>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </time>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${invoice.status}`}
                      role="status"
                      aria-label={`Status: ${invoice.status}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/billing/${invoice.id}`}
                      className="btn-action"
                      aria-label={`Process payment for invoice ${invoice.invoiceNumber}`}
                    >
                      Process
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessing;

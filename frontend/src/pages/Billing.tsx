/**
 * WF-COMP-XXX | Billing.tsx - Billing
 * Purpose: React component for Billing functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useInvoices } from '../hooks/useInvoices';
import '../styles/Page.css';

// Lazy load subfeature pages
const InvoiceGeneration = lazy(() => import('./billing/InvoiceGeneration'));
const PaymentProcessing = lazy(() => import('./billing/PaymentProcessing'));
const InsuranceClaims = lazy(() => import('./billing/InsuranceClaims'));
const Estimates = lazy(() => import('./billing/Estimates'));
const PaymentPlans = lazy(() => import('./billing/PaymentPlans'));
const Receivables = lazy(() => import('./billing/Receivables'));
const FinancialReports = lazy(() => import('./billing/FinancialReports'));
const Refunds = lazy(() => import('./billing/Refunds'));
const BillingCreate = lazy(() => import('./billing/BillingCreate'));
const BillingEdit = lazy(() => import('./billing/BillingEdit'));
const BillingDetail = lazy(() => import('./billing/BillingDetail'));

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  invoiceDate: string;
  status: string;
  client?: { id: string; firstName: string; lastName: string };
}

const BillingList = () => {
  const { data, isLoading: loading, isError } = useInvoices({ limit: 50 });

  const invoices = (data as { data?: Invoice[] } | undefined)?.data ?? [];

  return (
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
          <p>No invoices found. Create a new invoice to get started.</p>
        </div>
      ) : (
        <table className="data-table" role="table" aria-label="Invoices list">
          <thead>
            <tr>
              <th scope="col">Invoice #</th>
              <th scope="col">Client</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
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
                  <time dateTime={invoice.invoiceDate}>
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
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
                    to={`/billing/${invoice.id}/edit`}
                    className="btn-action"
                    aria-label={`Edit invoice ${invoice.invoiceNumber}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Billing = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">💰</span> Billing & Payment
        </h1>
        <Link to="/billing/create" className="btn-primary" aria-label="Create new invoice">
          + New Invoice
        </Link>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Billing sections">
        <Link
          to="/billing"
          className={`sub-nav-link ${location.pathname === '/billing' ? 'active' : ''}`}
        >
          Invoices
        </Link>
        <Link
          to="/billing/invoice-generation"
          className={`sub-nav-link ${location.pathname.includes('/invoice-generation') ? 'active' : ''}`}
        >
          Invoice Generation
        </Link>
        <Link
          to="/billing/payment-processing"
          className={`sub-nav-link ${location.pathname.includes('/payment-processing') ? 'active' : ''}`}
        >
          Payment Processing
        </Link>
        <Link
          to="/billing/insurance-claims"
          className={`sub-nav-link ${location.pathname.includes('/insurance-claims') ? 'active' : ''}`}
        >
          Insurance Claims
        </Link>
        <Link
          to="/billing/estimates"
          className={`sub-nav-link ${location.pathname.includes('/estimates') ? 'active' : ''}`}
        >
          Estimates & Quotes
        </Link>
        <Link
          to="/billing/payment-plans"
          className={`sub-nav-link ${location.pathname.includes('/payment-plans') ? 'active' : ''}`}
        >
          Payment Plans
        </Link>
        <Link
          to="/billing/receivables"
          className={`sub-nav-link ${location.pathname.includes('/receivables') ? 'active' : ''}`}
        >
          Receivables
        </Link>
        <Link
          to="/billing/financial-reports"
          className={`sub-nav-link ${location.pathname.includes('/financial-reports') ? 'active' : ''}`}
        >
          Financial Reports
        </Link>
        <Link
          to="/billing/refunds"
          className={`sub-nav-link ${location.pathname.includes('/refunds') ? 'active' : ''}`}
        >
          Refunds & Credits
        </Link>
      </nav>

      <Suspense
        fallback={
          <div role="status">
            <p>Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<BillingList />} />
          <Route path="/create" element={<BillingCreate />} />
          <Route path="/:id/edit" element={<BillingEdit />} />
          <Route path="/invoice-generation" element={<InvoiceGeneration />} />
          <Route path="/:id" element={<BillingDetail />} />
          <Route path="/payment-processing" element={<PaymentProcessing />} />
          <Route path="/insurance-claims" element={<InsuranceClaims />} />
          <Route path="/estimates" element={<Estimates />} />
          <Route path="/payment-plans" element={<PaymentPlans />} />
          <Route path="/receivables" element={<Receivables />} />
          <Route path="/financial-reports" element={<FinancialReports />} />
          <Route path="/refunds" element={<Refunds />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Billing;

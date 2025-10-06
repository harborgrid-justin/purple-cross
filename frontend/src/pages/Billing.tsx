import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
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

const BillingList = () => {
  const [invoices] = useState([
    { id: '1', client: 'John Smith', amount: 250.0, date: '2024-01-15', status: 'Paid' },
    { id: '2', client: 'Sarah Johnson', amount: 180.0, date: '2024-01-14', status: 'Pending' },
  ]);

  return (
    <div className="table-container">
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
              <th scope="row">#{invoice.id}</th>
              <td>{invoice.client}</td>
              <td>${invoice.amount.toFixed(2)}</td>
              <td>{invoice.date}</td>
              <td>
                <span
                  className={`status-badge status-${invoice.status === 'Paid' ? 'confirmed' : 'pending'}`}
                >
                  {invoice.status}
                </span>
              </td>
              <td>
                <button className="btn-action" aria-label={`View invoice for ${invoice.client}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Send invoice to ${invoice.client}`}>
                  Send
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        <button className="btn-primary" aria-label="Create new invoice">
          + New Invoice
        </button>
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
          <Route path="/invoice-generation" element={<InvoiceGeneration />} />
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

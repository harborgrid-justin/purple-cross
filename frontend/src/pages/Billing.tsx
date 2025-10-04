import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Billing = () => {
  const [invoices] = useState([
    { id: '1', client: 'John Smith', amount: 250.00, date: '2024-01-15', status: 'Paid' },
    { id: '2', client: 'Sarah Johnson', amount: 180.00, date: '2024-01-14', status: 'Pending' },
  ]);

  return (
    <div className="page">
      <header className="page-header">
        <h1><span aria-hidden="true">💰</span> Billing & Payment</h1>
        <button className="btn-primary" aria-label="Create new invoice">
          + New Invoice
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Billing sections">
        <Link to="/billing" className="sub-nav-link active">Invoices</Link>
        <Link to="/billing/invoice-generation" className="sub-nav-link">Invoice Generation</Link>
        <Link to="/billing/payment-processing" className="sub-nav-link">Payment Processing</Link>
        <Link to="/billing/insurance-claims" className="sub-nav-link">Insurance Claims</Link>
        <Link to="/billing/estimates" className="sub-nav-link">Estimates & Quotes</Link>
        <Link to="/billing/payment-plans" className="sub-nav-link">Payment Plans</Link>
        <Link to="/billing/receivables" className="sub-nav-link">Receivables</Link>
        <Link to="/billing/financial-reports" className="sub-nav-link">Financial Reports</Link>
        <Link to="/billing/refunds" className="sub-nav-link">Refunds & Credits</Link>
      </nav>

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
                  <span className={`status-badge status-${invoice.status === 'Paid' ? 'confirmed' : 'pending'}`}>
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
    </div>
  );
};

export default Billing;

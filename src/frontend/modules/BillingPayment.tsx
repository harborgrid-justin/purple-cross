import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useInvoices } from '../../frontend/src/hooks/useInvoices';
import '../styles/Module.css';

const BillingPayment: React.FC = () => {
  const { data, isLoading, error } = useInvoices();

  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Billing & Payment Processing</h1>
              <button className="btn-primary">Create Invoice</button>
            </div>

            <div className="module-nav">
              <Link to="/billing" className="tab-link active">Invoices</Link>
              <Link to="/billing/payments" className="tab-link">Payment Processing</Link>
              <Link to="/billing/insurance" className="tab-link">Insurance Claims</Link>
              <Link to="/billing/estimates" className="tab-link">Estimates</Link>
              <Link to="/billing/payment-plans" className="tab-link">Payment Plans</Link>
              <Link to="/billing/receivables" className="tab-link">Receivables</Link>
              <Link to="/billing/reports" className="tab-link">Financial Reports</Link>
            </div>

            <div className="content-section">
              {isLoading && <div className="loading">Loading invoices...</div>}
              {error && <div className="error">Error loading invoices: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && data.data && data.data.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((invoice: any) => (
                        <tr key={invoice.id}>
                          <td>{invoice.invoiceNumber || invoice.id}</td>
                          <td>{invoice.client?.firstName} {invoice.client?.lastName}</td>
                          <td>{new Date(invoice.issueDate || invoice.createdAt).toLocaleDateString()}</td>
                          <td>${invoice.totalAmount?.toFixed(2) || '0.00'}</td>
                          <td><span className={`badge badge-${invoice.status === 'paid' ? 'success' : 'warning'}`}>{invoice.status}</span></td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="info-cards">
                  <div className="info-card">
                    <h3>Invoice Management</h3>
                    <p>Complete billing and invoicing system</p>
                    <ul>
                      <li>Itemized billing</li>
                      <li>Multiple payment methods</li>
                      <li>Payment plans</li>
                      <li>Automated reminders</li>
                    </ul>
                  </div>
                  <div className="info-card">
                    <h3>Insurance Integration</h3>
                    <p>Pet insurance claim processing</p>
                    <ul>
                      <li>Electronic claim submission</li>
                      <li>Real-time adjudication</li>
                      <li>Automatic reconciliation</li>
                      <li>Multi-provider support</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default BillingPayment;

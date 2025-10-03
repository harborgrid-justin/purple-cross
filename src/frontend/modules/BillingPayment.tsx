import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const BillingPayment: React.FC = () => {
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
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default BillingPayment;

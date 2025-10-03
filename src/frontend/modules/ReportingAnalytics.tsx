import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const ReportingAnalytics: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Reporting & Analytics</h1>
              <button className="btn-primary">Generate Report</button>
            </div>

            <div className="module-nav">
              <Link to="/reports" className="tab-link active">Dashboard</Link>
              <Link to="/reports/financial" className="tab-link">Financial Reports</Link>
              <Link to="/reports/operational" className="tab-link">Operational</Link>
              <Link to="/reports/clinical" className="tab-link">Clinical Analytics</Link>
              <Link to="/reports/custom" className="tab-link">Custom Reports</Link>
              <Link to="/reports/kpis" className="tab-link">KPIs</Link>
              <Link to="/reports/trends" className="tab-link">Trend Analysis</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>Financial Analytics</h3>
                  <p>Revenue and profitability insights</p>
                  <ul>
                    <li>P&L statements</li>
                    <li>Revenue analysis</li>
                    <li>Cash flow tracking</li>
                    <li>Profitability reports</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Business Intelligence</h3>
                  <p>Operational and clinical insights</p>
                  <ul>
                    <li>Custom report builder</li>
                    <li>KPI dashboards</li>
                    <li>Trend analysis</li>
                    <li>Automated reporting</li>
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

export default ReportingAnalytics;

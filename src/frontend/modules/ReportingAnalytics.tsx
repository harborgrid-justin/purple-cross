import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useDashboardAnalytics } from '../../frontend/src/hooks/useAnalytics';
import '../styles/Module.css';

const ReportingAnalytics: React.FC = () => {
  const { data, isLoading, error } = useDashboardAnalytics();

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
              {isLoading && <div className="loading">Loading analytics...</div>}
              {error && <div className="error">Error loading analytics: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && data.data ? (
                <div className="analytics-dashboard">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>Total Patients</h3>
                      <p className="stat-value">{data.data.totalPatients || 0}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Active Clients</h3>
                      <p className="stat-value">{data.data.totalClients || 0}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Today's Appointments</h3>
                      <p className="stat-value">{data.data.todayAppointments || 0}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Monthly Revenue</h3>
                      <p className="stat-value">${data.data.monthlyRevenue?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default ReportingAnalytics;

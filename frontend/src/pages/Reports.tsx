import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import '../styles/Page.css';

// Lazy load subfeature pages
const Financial = lazy(() => import('./reports/Financial'));
const Operational = lazy(() => import('./reports/Operational'));
const Clinical = lazy(() => import('./reports/Clinical'));
const Builder = lazy(() => import('./reports/Builder'));
const Dashboard = lazy(() => import('./reports/Dashboard'));
const Trends = lazy(() => import('./reports/Trends'));
const ClientAnalytics = lazy(() => import('./reports/ClientAnalytics'));
const Export = lazy(() => import('./reports/Export'));

const ReportsList = () => {
  const [reports] = useState([
    {
      id: '1',
      name: 'Monthly Revenue Report',
      type: 'Financial',
      date: '2024-01-15',
      status: 'Ready',
    },
    {
      id: '2',
      name: 'Patient Visit Analytics',
      type: 'Operational',
      date: '2024-01-14',
      status: 'Processing',
    },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Reports list">
        <thead>
          <tr>
            <th scope="col">Report Name</th>
            <th scope="col">Type</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <th scope="row">{report.name}</th>
              <td>{report.type}</td>
              <td>{report.date}</td>
              <td>
                <span
                  className={`status-badge status-${report.status === 'Ready' ? 'confirmed' : 'pending'}`}
                >
                  {report.status}
                </span>
              </td>
              <td>
                <button className="btn-action" aria-label={`View ${report.name}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Download ${report.name}`}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Reports = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📈</span> Reports & Analytics
        </h1>
        <button className="btn-primary" aria-label="Generate new report">
          + Generate Report
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Reports sections">
        <Link
          to="/reports"
          className={`sub-nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
        >
          All Reports
        </Link>
        <Link
          to="/reports/financial"
          className={`sub-nav-link ${location.pathname.includes('/financial') ? 'active' : ''}`}
        >
          Financial Reports
        </Link>
        <Link
          to="/reports/operational"
          className={`sub-nav-link ${location.pathname.includes('/operational') ? 'active' : ''}`}
        >
          Operational Reports
        </Link>
        <Link
          to="/reports/clinical"
          className={`sub-nav-link ${location.pathname.includes('/clinical') ? 'active' : ''}`}
        >
          Clinical Analytics
        </Link>
        <Link
          to="/reports/builder"
          className={`sub-nav-link ${location.pathname.includes('/builder') ? 'active' : ''}`}
        >
          Custom Report Builder
        </Link>
        <Link
          to="/reports/dashboard"
          className={`sub-nav-link ${location.pathname.includes('/dashboard') ? 'active' : ''}`}
        >
          Dashboard & KPIs
        </Link>
        <Link
          to="/reports/trends"
          className={`sub-nav-link ${location.pathname.includes('/trends') ? 'active' : ''}`}
        >
          Trend Analysis
        </Link>
        <Link
          to="/reports/client-analytics"
          className={`sub-nav-link ${location.pathname.includes('/client-analytics') ? 'active' : ''}`}
        >
          Client Analytics
        </Link>
        <Link
          to="/reports/export"
          className={`sub-nav-link ${location.pathname.includes('/export') ? 'active' : ''}`}
        >
          Export & Scheduling
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
          <Route path="/" element={<ReportsList />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/operational" element={<Operational />} />
          <Route path="/clinical" element={<Clinical />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/client-analytics" element={<ClientAnalytics />} />
          <Route path="/export" element={<Export />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Reports;

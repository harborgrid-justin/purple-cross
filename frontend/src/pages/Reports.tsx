import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Reports = () => {
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
        <Link to="/reports" className="sub-nav-link active">
          All Reports
        </Link>
        <Link to="/reports/financial" className="sub-nav-link">
          Financial Reports
        </Link>
        <Link to="/reports/operational" className="sub-nav-link">
          Operational Reports
        </Link>
        <Link to="/reports/clinical" className="sub-nav-link">
          Clinical Analytics
        </Link>
        <Link to="/reports/builder" className="sub-nav-link">
          Custom Report Builder
        </Link>
        <Link to="/reports/dashboard" className="sub-nav-link">
          Dashboard & KPIs
        </Link>
        <Link to="/reports/trends" className="sub-nav-link">
          Trend Analysis
        </Link>
        <Link to="/reports/client-analytics" className="sub-nav-link">
          Client Analytics
        </Link>
        <Link to="/reports/export" className="sub-nav-link">
          Export & Scheduling
        </Link>
      </nav>

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
    </div>
  );
};

export default Reports;

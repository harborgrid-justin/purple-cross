/**
 * WF-COMP-COMPLIANCE-007 | ComplianceMain.tsx - Main compliance page
 * Purpose: Main compliance list and navigation page
 * Related: ComplianceList component, compliance routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import '../../styles/Page.css';

// Lazy load subfeature pages
const HIPAA = lazy(() => import('./HIPAA'));
const Licenses = lazy(() => import('./Licenses'));
const ControlledSubstances = lazy(() => import('./ControlledSubstances'));
const RecordRetention = lazy(() => import('./RecordRetention'));
const IncidentReporting = lazy(() => import('./IncidentReporting'));
const Policies = lazy(() => import('./Policies'));
const AuditPrep = lazy(() => import('./AuditPrep'));
const Updates = lazy(() => import('./Updates'));

const ComplianceList = () => {
  const [items] = useState([
    {
      id: '1',
      type: 'License',
      name: 'Dr. Smith DEA License',
      expiry: '2024-12-31',
      status: 'Active',
    },
    {
      id: '2',
      type: 'Audit',
      name: 'HIPAA Compliance Audit',
      date: '2024-01-15',
      status: 'Completed',
    },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Compliance items list">
        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Name</th>
            <th scope="col">Date/Expiry</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.type}</td>
              <th scope="row">{item.name}</th>
              <td>{item.expiry || item.date}</td>
              <td>
                <span
                  className={`status-badge status-${item.status === 'Active' || item.status === 'Completed' ? 'confirmed' : 'pending'}`}
                >
                  {item.status}
                </span>
              </td>
              <td>
                <button className="btn-action" aria-label={`View ${item.name}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Manage ${item.name}`}>
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ComplianceMain = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✓</span> Compliance & Regulatory
        </h1>
        <button className="btn-primary" aria-label="Add compliance item">
          + Add Item
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Compliance sections">
        <Link
          to="/compliance"
          className={`sub-nav-link ${location.pathname === '/compliance' ? 'active' : ''}`}
        >
          Overview
        </Link>
        <Link
          to="/compliance/hipaa"
          className={`sub-nav-link ${location.pathname.includes('/hipaa') ? 'active' : ''}`}
        >
          HIPAA Compliance
        </Link>
        <Link
          to="/compliance/licenses"
          className={`sub-nav-link ${location.pathname.includes('/licenses') ? 'active' : ''}`}
        >
          License Tracking
        </Link>
        <Link
          to="/compliance/controlled-substances"
          className={`sub-nav-link ${location.pathname.includes('/controlled-substances') ? 'active' : ''}`}
        >
          Controlled Substances
        </Link>
        <Link
          to="/compliance/record-retention"
          className={`sub-nav-link ${location.pathname.includes('/record-retention') ? 'active' : ''}`}
        >
          Record Retention
        </Link>
        <Link
          to="/compliance/incident-reporting"
          className={`sub-nav-link ${location.pathname.includes('/incident-reporting') ? 'active' : ''}`}
        >
          Incident Reporting
        </Link>
        <Link
          to="/compliance/policies"
          className={`sub-nav-link ${location.pathname.includes('/policies') ? 'active' : ''}`}
        >
          Policy Management
        </Link>
        <Link
          to="/compliance/audit-prep"
          className={`sub-nav-link ${location.pathname.includes('/audit-prep') ? 'active' : ''}`}
        >
          Audit Preparation
        </Link>
        <Link
          to="/compliance/updates"
          className={`sub-nav-link ${location.pathname.includes('/updates') ? 'active' : ''}`}
        >
          Regulatory Updates
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
          <Route path="/" element={<ComplianceList />} />
          <Route path="/hipaa" element={<HIPAA />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/controlled-substances" element={<ControlledSubstances />} />
          <Route path="/record-retention" element={<RecordRetention />} />
          <Route path="/incident-reporting" element={<IncidentReporting />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/audit-prep" element={<AuditPrep />} />
          <Route path="/updates" element={<Updates />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default ComplianceMain;

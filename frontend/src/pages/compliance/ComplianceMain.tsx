/**
 * WF-COMP-COMPLIANCE-007 | ComplianceMain.tsx - Main compliance page
 * Purpose: Main compliance list and navigation page
 * Related: ComplianceList component, compliance routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import { Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { usePolicies } from '../../hooks/usePolicies';
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

interface ComplianceRow {
  id: string;
  title: string;
  category: string;
  status?: string;
  effectiveDate?: string;
}

const ComplianceList = () => {
  const { data, isLoading, isError } = usePolicies({ limit: 50 });

  const items = (data as { data?: ComplianceRow[] } | undefined)?.data ?? [];

  return (
    <div className="table-container">
      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading compliance items...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load compliance items. Please try again.</p>
        </div>
      ) : items.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No compliance items found. Add one to get started.</p>
        </div>
      ) : (
        <table className="data-table" role="table" aria-label="Compliance items list">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Title</th>
              <th scope="col">Effective Date</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <th scope="row">{item.title}</th>
                <td>
                  {item.effectiveDate ? (
                    <time dateTime={item.effectiveDate}>
                      {new Date(item.effectiveDate).toLocaleDateString()}
                    </time>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  <span className="status-badge status-confirmed">{item.status || 'N/A'}</span>
                </td>
                <td>
                  <Link
                    to={`/compliance/${item.id}`}
                    className="btn-action"
                    aria-label={`View ${item.title}`}
                  >
                    View
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

const ComplianceMain = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✓</span> Compliance & Regulatory
        </h1>
        <Link to="/compliance/create" className="btn-primary" aria-label="Add compliance item">
          + Add Item
        </Link>
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

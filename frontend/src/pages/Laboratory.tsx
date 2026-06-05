/**
 * WF-COMP-XXX | Laboratory.tsx - Laboratory
 * Purpose: React component for Laboratory functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useLabTests } from '../hooks/useLabTests';
import '../styles/Page.css';

// Lazy load subfeature pages
const InHouse = lazy(() => import('./laboratory/InHouse'));
const External = lazy(() => import('./laboratory/External'));
const TestCatalog = lazy(() => import('./laboratory/TestCatalog'));
const SampleTracking = lazy(() => import('./laboratory/SampleTracking'));
const Results = lazy(() => import('./laboratory/Results'));
const QualityAssurance = lazy(() => import('./laboratory/QualityAssurance'));
const LabEquipment = lazy(() => import('./laboratory/LabEquipment'));
const LabReports = lazy(() => import('./laboratory/LabReports'));
const LaboratoryCreate = lazy(() => import('./laboratory/LaboratoryCreate'));
const LaboratoryDetail = lazy(() => import('./laboratory/LaboratoryDetail'));
const LaboratoryEdit = lazy(() => import('./laboratory/LaboratoryEdit'));

interface LabTestListRow {
  id: string;
  testName?: string;
  testType?: string;
  status?: string;
  orderedDate?: string;
  patient?: { id: string; name: string };
}

const LaboratoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading: loading, isError } = useLabTests({ limit: 50 });

  const tests = (data as { data?: LabTestListRow[] } | undefined)?.data ?? [];

  const searchLower = searchTerm.toLowerCase();
  const filtered = searchTerm
    ? tests.filter(
        (t) =>
          (t.patient?.name ?? '').toLowerCase().includes(searchLower) ||
          (t.testName ?? '').toLowerCase().includes(searchLower) ||
          (t.testType ?? '').toLowerCase().includes(searchLower)
      )
    : tests;

  return (
    <div className="table-container">
      <div className="search-bar" role="search">
        <label htmlFor="lab-test-search" className="sr-only">
          Search lab tests
        </label>
        <input
          id="lab-test-search"
          type="search"
          placeholder="Search lab tests by patient, test name, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search lab tests by patient, test name, or type"
        />
      </div>
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading lab tests...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load lab tests. Please try again.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No lab tests found. Order a new test to get started.</p>
        </div>
      ) : (
        <table className="data-table" role="table" aria-label="Laboratory tests list">
          <thead>
            <tr>
              <th scope="col">Test</th>
              <th scope="col">Patient</th>
              <th scope="col">Type</th>
              <th scope="col">Ordered</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((test) => (
              <tr key={test.id}>
                <th scope="row">{test.testName ?? 'N/A'}</th>
                <td>{test.patient?.name ?? 'Unknown'}</td>
                <td>{test.testType ?? 'N/A'}</td>
                <td>
                  {test.orderedDate ? (
                    <time dateTime={test.orderedDate}>
                      {new Date(test.orderedDate).toLocaleDateString()}
                    </time>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  <span className={`status-badge status-${test.status ?? 'pending'}`}>
                    {test.status ?? 'pending'}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/laboratory/${test.id}`}
                    className="btn-action"
                    aria-label={`View test ${test.testName ?? ''}`}
                  >
                    View
                  </Link>
                  <Link
                    to={`/laboratory/${test.id}/edit`}
                    className="btn-action"
                    aria-label={`Edit test ${test.testName ?? ''}`}
                  >
                    Edit
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

const Laboratory = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔬</span> Laboratory
        </h1>
        <Link to="/laboratory/create" className="btn-primary" aria-label="Order new lab test">
          + Order Test
        </Link>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Laboratory sections">
        <Link
          to="/laboratory"
          className={`sub-nav-link ${location.pathname === '/laboratory' ? 'active' : ''}`}
        >
          All Tests
        </Link>
        <Link
          to="/laboratory/in-house"
          className={`sub-nav-link ${location.pathname.includes('/in-house') ? 'active' : ''}`}
        >
          In-House Testing
        </Link>
        <Link
          to="/laboratory/external"
          className={`sub-nav-link ${location.pathname.includes('/external') ? 'active' : ''}`}
        >
          External Lab Integration
        </Link>
        <Link
          to="/laboratory/test-catalog"
          className={`sub-nav-link ${location.pathname.includes('/test-catalog') ? 'active' : ''}`}
        >
          Test Catalog
        </Link>
        <Link
          to="/laboratory/sample-tracking"
          className={`sub-nav-link ${location.pathname.includes('/sample-tracking') ? 'active' : ''}`}
        >
          Sample Tracking
        </Link>
        <Link
          to="/laboratory/results"
          className={`sub-nav-link ${location.pathname.includes('/results') ? 'active' : ''}`}
        >
          Result Interpretation
        </Link>
        <Link
          to="/laboratory/quality-assurance"
          className={`sub-nav-link ${location.pathname.includes('/quality-assurance') ? 'active' : ''}`}
        >
          Quality Assurance
        </Link>
        <Link
          to="/laboratory/equipment"
          className={`sub-nav-link ${location.pathname.includes('/equipment') ? 'active' : ''}`}
        >
          Equipment Management
        </Link>
        <Link
          to="/laboratory/reports"
          className={`sub-nav-link ${location.pathname.includes('/reports') ? 'active' : ''}`}
        >
          Lab Reports
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
          <Route path="/" element={<LaboratoryList />} />
          <Route path="/create" element={<LaboratoryCreate />} />
          <Route path="/in-house" element={<InHouse />} />
          <Route path="/external" element={<External />} />
          <Route path="/test-catalog" element={<TestCatalog />} />
          <Route path="/sample-tracking" element={<SampleTracking />} />
          <Route path="/results" element={<Results />} />
          <Route path="/quality-assurance" element={<QualityAssurance />} />
          <Route path="/equipment" element={<LabEquipment />} />
          <Route path="/reports" element={<LabReports />} />
          <Route path="/:id/edit" element={<LaboratoryEdit />} />
          <Route path="/:id" element={<LaboratoryDetail />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Laboratory;

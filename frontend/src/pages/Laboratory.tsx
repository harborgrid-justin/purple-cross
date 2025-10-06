import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
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

const LaboratoryList = () => {
  const [tests] = useState([
    { id: '1', patient: 'Max', testType: 'Blood Work', status: 'Completed', date: '2024-01-15' },
    { id: '2', patient: 'Luna', testType: 'Urinalysis', status: 'In Progress', date: '2024-01-16' },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Laboratory tests list">
        <thead>
          <tr>
            <th scope="col">Test ID</th>
            <th scope="col">Patient</th>
            <th scope="col">Test Type</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <th scope="row">#{test.id}</th>
              <td>{test.patient}</td>
              <td>{test.testType}</td>
              <td>{test.date}</td>
              <td>
                <span
                  className={`status-badge status-${test.status === 'Completed' ? 'confirmed' : 'pending'}`}
                >
                  {test.status}
                </span>
              </td>
              <td>
                <button className="btn-action" aria-label={`View test results for ${test.patient}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Download results for ${test.patient}`}>
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

const Laboratory = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔬</span> Laboratory
        </h1>
        <button className="btn-primary" aria-label="Order new lab test">
          + Order Test
        </button>
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
          <Route path="/in-house" element={<InHouse />} />
          <Route path="/external" element={<External />} />
          <Route path="/test-catalog" element={<TestCatalog />} />
          <Route path="/sample-tracking" element={<SampleTracking />} />
          <Route path="/results" element={<Results />} />
          <Route path="/quality-assurance" element={<QualityAssurance />} />
          <Route path="/equipment" element={<LabEquipment />} />
          <Route path="/reports" element={<LabReports />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Laboratory;

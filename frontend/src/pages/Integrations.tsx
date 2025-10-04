import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import '../styles/Page.css';

// Lazy load subfeature pages
const ThirdParty = lazy(() => import('./integrations/ThirdParty'));
const API = lazy(() => import('./integrations/API'));
const ImportExport = lazy(() => import('./integrations/ImportExport'));
const HL7FHIR = lazy(() => import('./integrations/HL7FHIR'));
const Webhooks = lazy(() => import('./integrations/Webhooks'));
const SSO = lazy(() => import('./integrations/SSO'));
const Accounting = lazy(() => import('./integrations/Accounting'));
const APIAnalytics = lazy(() => import('./integrations/APIAnalytics'));

const IntegrationsList = () => {
  const [integrations] = useState([
    { id: '1', name: 'QuickBooks', type: 'Accounting', status: 'Connected', lastSync: '2024-01-15' },
    { id: '2', name: 'Idexx Laboratory', type: 'Lab', status: 'Active', lastSync: '2024-01-16' },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Integrations list">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Last Sync</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {integrations.map((integration) => (
            <tr key={integration.id}>
              <th scope="row">{integration.name}</th>
              <td>{integration.type}</td>
              <td>
                <span className="status-badge status-confirmed">
                  {integration.status}
                </span>
              </td>
              <td>{integration.lastSync}</td>
              <td>
                <button className="btn-action" aria-label={`Configure ${integration.name}`}>
                  Configure
                </button>
                <button className="btn-action" aria-label={`Sync ${integration.name}`}>
                  Sync
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Integrations = () => {
  const location = useLocation();
  
  return (
    <div className="page">
      <header className="page-header">
        <h1><span aria-hidden="true">🔗</span> Integrations & API</h1>
        <button className="btn-primary" aria-label="Add new integration">
          + Add Integration
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Integrations sections">
        <Link to="/integrations" className={`sub-nav-link ${location.pathname === '/integrations' ? 'active' : ''}`}>All Integrations</Link>
        <Link to="/integrations/third-party" className={`sub-nav-link ${location.pathname.includes('/third-party') ? 'active' : ''}`}>Third-Party</Link>
        <Link to="/integrations/api" className={`sub-nav-link ${location.pathname.includes('/api') ? 'active' : ''}`}>RESTful API</Link>
        <Link to="/integrations/import-export" className={`sub-nav-link ${location.pathname.includes('/import-export') ? 'active' : ''}`}>Data Import/Export</Link>
        <Link to="/integrations/hl7-fhir" className={`sub-nav-link ${location.pathname.includes('/hl7-fhir') ? 'active' : ''}`}>HL7/FHIR</Link>
        <Link to="/integrations/webhooks" className={`sub-nav-link ${location.pathname.includes('/webhooks') ? 'active' : ''}`}>Webhooks</Link>
        <Link to="/integrations/sso" className={`sub-nav-link ${location.pathname.includes('/sso') ? 'active' : ''}`}>Single Sign-On</Link>
        <Link to="/integrations/accounting" className={`sub-nav-link ${location.pathname.includes('/accounting') ? 'active' : ''}`}>Accounting Software</Link>
        <Link to="/integrations/analytics" className={`sub-nav-link ${location.pathname.includes('/analytics') ? 'active' : ''}`}>API Analytics</Link>
      </nav>

      <Suspense fallback={<div role="status"><p>Loading...</p></div>}>
        <Routes>
          <Route path="/" element={<IntegrationsList />} />
          <Route path="/third-party" element={<ThirdParty />} />
          <Route path="/api" element={<API />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/hl7-fhir" element={<HL7FHIR />} />
          <Route path="/webhooks" element={<Webhooks />} />
          <Route path="/sso" element={<SSO />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/analytics" element={<APIAnalytics />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Integrations;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Integrations = () => {
  const [integrations] = useState([
    {
      id: '1',
      name: 'QuickBooks',
      type: 'Accounting',
      status: 'Connected',
      lastSync: '2024-01-15',
    },
    { id: '2', name: 'Idexx Laboratory', type: 'Lab', status: 'Active', lastSync: '2024-01-16' },
  ]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔗</span> Integrations & API
        </h1>
        <button className="btn-primary" aria-label="Add new integration">
          + Add Integration
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Integrations sections">
        <Link to="/integrations" className="sub-nav-link active">
          All Integrations
        </Link>
        <Link to="/integrations/third-party" className="sub-nav-link">
          Third-Party
        </Link>
        <Link to="/integrations/api" className="sub-nav-link">
          RESTful API
        </Link>
        <Link to="/integrations/import-export" className="sub-nav-link">
          Data Import/Export
        </Link>
        <Link to="/integrations/hl7-fhir" className="sub-nav-link">
          HL7/FHIR
        </Link>
        <Link to="/integrations/webhooks" className="sub-nav-link">
          Webhooks
        </Link>
        <Link to="/integrations/sso" className="sub-nav-link">
          Single Sign-On
        </Link>
        <Link to="/integrations/accounting" className="sub-nav-link">
          Accounting Software
        </Link>
        <Link to="/integrations/analytics" className="sub-nav-link">
          API Analytics
        </Link>
      </nav>

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
                  <span className="status-badge status-confirmed">{integration.status}</span>
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
    </div>
  );
};

export default Integrations;

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const IntegrationAPI: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Integration & API Management</h1>
              <button className="btn-primary">New Integration</button>
            </div>

            <div className="module-nav">
              <Link to="/integrations" className="tab-link active">Third-Party</Link>
              <Link to="/integrations/api" className="tab-link">RESTful API</Link>
              <Link to="/integrations/import-export" className="tab-link">Import/Export</Link>
              <Link to="/integrations/hl7-fhir" className="tab-link">HL7/FHIR</Link>
              <Link to="/integrations/webhooks" className="tab-link">Webhooks</Link>
              <Link to="/integrations/sso" className="tab-link">SSO</Link>
              <Link to="/integrations/accounting" className="tab-link">Accounting</Link>
              <Link to="/integrations/analytics" className="tab-link">API Analytics</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>Third-Party Integrations</h3>
                  <p>Connect with external services</p>
                  <ul>
                    <li>Laboratory systems</li>
                    <li>Payment processors</li>
                    <li>Pharmacy networks</li>
                    <li>Accounting software</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>API Platform</h3>
                  <p>RESTful API and webhooks</p>
                  <ul>
                    <li>Comprehensive endpoints</li>
                    <li>API key management</li>
                    <li>Webhook events</li>
                    <li>Usage analytics</li>
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

export default IntegrationAPI;

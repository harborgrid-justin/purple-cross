import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const ComplianceRegulatory: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Compliance & Regulatory Management</h1>
              <button className="btn-primary">Run Audit</button>
            </div>

            <div className="module-nav">
              <Link to="/compliance" className="tab-link active">HIPAA Compliance</Link>
              <Link to="/compliance/licenses" className="tab-link">Licenses</Link>
              <Link to="/compliance/controlled" className="tab-link">Controlled Substances</Link>
              <Link to="/compliance/retention" className="tab-link">Record Retention</Link>
              <Link to="/compliance/incidents" className="tab-link">Incident Reports</Link>
              <Link to="/compliance/policies" className="tab-link">Policies</Link>
              <Link to="/compliance/audit" className="tab-link">Audit Prep</Link>
              <Link to="/compliance/updates" className="tab-link">Regulatory Updates</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>Compliance Management</h3>
                  <p>Regulatory compliance tools</p>
                  <ul>
                    <li>HIPAA-equivalent standards</li>
                    <li>Audit logging</li>
                    <li>License tracking</li>
                    <li>DEA reporting</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Risk Management</h3>
                  <p>Incident and policy management</p>
                  <ul>
                    <li>Incident reporting</li>
                    <li>Policy repository</li>
                    <li>Audit preparation</li>
                    <li>Regulatory monitoring</li>
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

export default ComplianceRegulatory;

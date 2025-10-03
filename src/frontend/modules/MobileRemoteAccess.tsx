import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const MobileRemoteAccess: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Mobile & Remote Access</h1>
              <button className="btn-primary">Configure Device</button>
            </div>

            <div className="module-nav">
              <Link to="/mobile" className="tab-link active">Mobile Apps</Link>
              <Link to="/mobile/tablet" className="tab-link">Tablet Interface</Link>
              <Link to="/mobile/remote" className="tab-link">Remote Access</Link>
              <Link to="/mobile/field-service" className="tab-link">Field Service</Link>
              <Link to="/mobile/emergency" className="tab-link">Emergency Access</Link>
              <Link to="/mobile/offline" className="tab-link">Offline Mode</Link>
              <Link to="/mobile/reporting" className="tab-link">Mobile Reports</Link>
              <Link to="/mobile/sync" className="tab-link">Sync Settings</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>Mobile Applications</h3>
                  <p>iOS and Android apps</p>
                  <ul>
                    <li>Native mobile apps</li>
                    <li>Tablet optimization</li>
                    <li>Offline functionality</li>
                    <li>Real-time sync</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Field Service</h3>
                  <p>Mobile veterinary services</p>
                  <ul>
                    <li>GPS tracking</li>
                    <li>Route optimization</li>
                    <li>Mobile invoicing</li>
                    <li>Digital signatures</li>
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

export default MobileRemoteAccess;

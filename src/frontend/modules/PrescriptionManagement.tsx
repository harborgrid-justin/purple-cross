import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const PrescriptionManagement: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Prescription & Medication Management</h1>
              <button className="btn-primary">New Prescription</button>
            </div>

            <div className="module-nav">
              <Link to="/prescriptions" className="tab-link active">E-Prescribing</Link>
              <Link to="/prescriptions/database" className="tab-link">Drug Database</Link>
              <Link to="/prescriptions/history" className="tab-link">History</Link>
              <Link to="/prescriptions/calculators" className="tab-link">Dosage Calculators</Link>
              <Link to="/prescriptions/interactions" className="tab-link">Interactions</Link>
              <Link to="/prescriptions/controlled" className="tab-link">Controlled Substances</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>E-Prescribing</h3>
                  <p>Digital prescription management system</p>
                  <ul>
                    <li>Electronic prescription creation</li>
                    <li>Automated refill management</li>
                    <li>Drug interaction checking</li>
                    <li>DEA compliance tracking</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Safety Features</h3>
                  <p>Advanced medication safety tools</p>
                  <ul>
                    <li>Weight-based dosing</li>
                    <li>Allergy alerts</li>
                    <li>Interaction warnings</li>
                    <li>Controlled substance monitoring</li>
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

export default PrescriptionManagement;

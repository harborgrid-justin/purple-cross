import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const MedicalRecords: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Medical Records & History</h1>
              <button className="btn-primary">New Record</button>
            </div>

            <div className="module-nav">
              <Link to="/medical-records" className="tab-link active">EMR</Link>
              <Link to="/medical-records/templates" className="tab-link">Note Templates</Link>
              <Link to="/medical-records/diagnostics" className="tab-link">Diagnostics</Link>
              <Link to="/medical-records/vitals" className="tab-link">Vital Signs</Link>
              <Link to="/medical-records/attachments" className="tab-link">Attachments</Link>
              <Link to="/medical-records/sharing" className="tab-link">Record Sharing</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>Electronic Medical Records</h3>
                  <p>Comprehensive medical history tracking for all patients</p>
                  <ul>
                    <li>SOAP notes with templates</li>
                    <li>Treatment history timeline</li>
                    <li>Diagnostic result integration</li>
                    <li>Complete audit trail</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Clinical Documentation</h3>
                  <p>Streamlined documentation workflows</p>
                  <ul>
                    <li>Customizable templates</li>
                    <li>Voice-to-text input</li>
                    <li>Image and file attachments</li>
                    <li>Secure record sharing</li>
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

export default MedicalRecords;

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const LaboratoryManagement: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Laboratory Management</h1>
              <button className="btn-primary">Order Test</button>
            </div>

            <div className="module-nav">
              <Link to="/laboratory" className="tab-link active">Lab Tests</Link>
              <Link to="/laboratory/in-house" className="tab-link">In-House Testing</Link>
              <Link to="/laboratory/external" className="tab-link">External Labs</Link>
              <Link to="/laboratory/catalog" className="tab-link">Test Catalog</Link>
              <Link to="/laboratory/specimens" className="tab-link">Sample Tracking</Link>
              <Link to="/laboratory/qa" className="tab-link">Quality Assurance</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>Lab Testing</h3>
                  <p>Comprehensive laboratory test management</p>
                  <ul>
                    <li>In-house test ordering</li>
                    <li>External lab integration</li>
                    <li>Automated result flagging</li>
                    <li>Result interpretation tools</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Quality Control</h3>
                  <p>Laboratory quality assurance</p>
                  <ul>
                    <li>Specimen tracking</li>
                    <li>Chain of custody</li>
                    <li>Equipment calibration</li>
                    <li>Quality metrics</li>
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

export default LaboratoryManagement;

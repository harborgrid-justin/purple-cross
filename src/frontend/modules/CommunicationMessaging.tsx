import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const CommunicationMessaging: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Communication & Messaging</h1>
              <button className="btn-primary">New Message</button>
            </div>

            <div className="module-nav">
              <Link to="/communications" className="tab-link active">Client Portal</Link>
              <Link to="/communications/sms" className="tab-link">SMS Messaging</Link>
              <Link to="/communications/email" className="tab-link">Email</Link>
              <Link to="/communications/voice" className="tab-link">Voice Calling</Link>
              <Link to="/communications/telemedicine" className="tab-link">Telemedicine</Link>
              <Link to="/communications/notifications" className="tab-link">Push Notifications</Link>
              <Link to="/communications/social" className="tab-link">Social Media</Link>
              <Link to="/communications/campaigns" className="tab-link">Marketing</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>Multi-Channel Communication</h3>
                  <p>Engage clients across all channels</p>
                  <ul>
                    <li>SMS & email campaigns</li>
                    <li>Two-way messaging</li>
                    <li>Automated reminders</li>
                    <li>Social media integration</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Telemedicine</h3>
                  <p>Virtual care and consultations</p>
                  <ul>
                    <li>Video consultations</li>
                    <li>Secure messaging</li>
                    <li>Virtual appointments</li>
                    <li>Remote monitoring</li>
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

export default CommunicationMessaging;

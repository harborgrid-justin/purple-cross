import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useCommunications } from '../../frontend/src/hooks/useCommunications';
import '../styles/Module.css';

const CommunicationMessaging: React.FC = () => {
  const { data, isLoading, error } = useCommunications();

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
              {isLoading && <div className="loading">Loading communications...</div>}
              {error && <div className="error">Error loading communications: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && data.data && data.data.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Type</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((comm: any) => (
                        <tr key={comm.id}>
                          <td>{new Date(comm.sentDate || comm.createdAt).toLocaleDateString()}</td>
                          <td>{comm.client?.firstName} {comm.client?.lastName}</td>
                          <td>{comm.communicationType || comm.type}</td>
                          <td>{comm.subject}</td>
                          <td><span className={`badge badge-${comm.status === 'sent' ? 'success' : comm.status === 'pending' ? 'warning' : 'info'}`}>{comm.status}</span></td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Reply</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
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
              )}
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default CommunicationMessaging;

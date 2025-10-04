import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useMedicalRecords } from '../../frontend/src/hooks/useMedicalRecords';
import '../styles/Module.css';

const MedicalRecords: React.FC = () => {
  const { data, isLoading, error } = useMedicalRecords();

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
              {isLoading && <div className="loading">Loading medical records...</div>}
              {error && <div className="error">Error loading medical records: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && data.data && data.data.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Type</th>
                        <th>Veterinarian</th>
                        <th>Diagnosis</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((record: any) => (
                        <tr key={record.id}>
                          <td>{new Date(record.visitDate || record.createdAt).toLocaleDateString()}</td>
                          <td>{record.patient?.name}</td>
                          <td>{record.recordType || 'General'}</td>
                          <td>{record.veterinarian?.firstName} {record.veterinarian?.lastName}</td>
                          <td>{record.diagnosis || record.chiefComplaint}</td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
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
              )}
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default MedicalRecords;

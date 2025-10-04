import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { usePrescriptions } from '../../frontend/src/hooks/usePrescriptions';
import '../styles/Module.css';

const PrescriptionManagement: React.FC = () => {
  const { data, isLoading, error } = usePrescriptions();

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
              {isLoading && <div className="loading">Loading prescriptions...</div>}
              {error && <div className="error">Error loading prescriptions: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && data.data && data.data.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Veterinarian</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((prescription: any) => (
                        <tr key={prescription.id}>
                          <td>{new Date(prescription.prescribedDate || prescription.createdAt).toLocaleDateString()}</td>
                          <td>{prescription.patient?.name}</td>
                          <td>{prescription.medication?.name || prescription.medicationName}</td>
                          <td>{prescription.dosage} {prescription.dosageUnit}</td>
                          <td>{prescription.veterinarian?.firstName} {prescription.veterinarian?.lastName}</td>
                          <td><span className={`badge badge-${prescription.status === 'active' ? 'success' : 'secondary'}`}>{prescription.status}</span></td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Refill</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
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
              )}
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default PrescriptionManagement;

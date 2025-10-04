import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { usePatients } from '../../frontend/src/hooks/usePatients';
import '../styles/Module.css';

const PatientManagement: React.FC = () => {
  const { data, isLoading, error } = usePatients();

  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Patient Management</h1>
              <button className="btn-primary">Add New Patient</button>
            </div>

            <div className="module-nav">
              <Link to="/patients" className="tab-link active">All Patients</Link>
              <Link to="/patients/search" className="tab-link">Search & Filter</Link>
              <Link to="/patients/demographics" className="tab-link">Demographics</Link>
              <Link to="/patients/health-status" className="tab-link">Health Status</Link>
              <Link to="/patients/reminders" className="tab-link">Reminders</Link>
            </div>

            <div className="content-section">
              {isLoading && <div className="loading">Loading patients...</div>}
              {error && <div className="error">Error loading patients: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Species</th>
                        <th>Breed</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data?.map((patient: any) => (
                        <tr key={patient.id}>
                          <td>{patient.id}</td>
                          <td>{patient.name}</td>
                          <td>{patient.species}</td>
                          <td>{patient.breed}</td>
                          <td>{patient.owner?.firstName} {patient.owner?.lastName}</td>
                          <td><span className="badge badge-success">Active</span></td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Edit</button>
                          </td>
                        </tr>
                      )) || <tr><td colSpan={7}>No patients found</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default PatientManagement;

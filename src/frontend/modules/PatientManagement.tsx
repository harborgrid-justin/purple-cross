import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const PatientManagement: React.FC = () => {
  const [patients] = useState([
    { id: '1', name: 'Max', species: 'Dog', breed: 'Golden Retriever', owner: 'John Smith', status: 'Active' },
    { id: '2', name: 'Luna', species: 'Cat', breed: 'Siamese', owner: 'Sarah Johnson', status: 'Active' },
    { id: '3', name: 'Charlie', species: 'Dog', breed: 'Labrador', owner: 'Mike Wilson', status: 'Active' },
  ]);

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
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.species}</td>
                        <td>{patient.breed}</td>
                        <td>{patient.owner}</td>
                        <td><span className="badge badge-success">{patient.status}</span></td>
                        <td>
                          <button className="btn-small">View</button>
                          <button className="btn-small">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default PatientManagement;

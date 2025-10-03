import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const ClientManagement: React.FC = () => {
  const [clients] = useState([
    { id: '1', name: 'John Smith', email: 'john@email.com', phone: '555-0101', pets: 2, status: 'Active' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '555-0102', pets: 1, status: 'Active' },
    { id: '3', name: 'Mike Wilson', email: 'mike@email.com', phone: '555-0103', pets: 3, status: 'VIP' },
  ]);

  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Client Management</h1>
              <button className="btn-primary">Add New Client</button>
            </div>

            <div className="module-nav">
              <Link to="/clients" className="tab-link active">All Clients</Link>
              <Link to="/clients/accounts" className="tab-link">Accounts</Link>
              <Link to="/clients/portal" className="tab-link">Portal Access</Link>
              <Link to="/clients/loyalty" className="tab-link">Loyalty Programs</Link>
              <Link to="/clients/feedback" className="tab-link">Feedback</Link>
            </div>

            <div className="content-section">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Client ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Pets</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td>{client.id}</td>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>{client.pets}</td>
                        <td><span className={`badge ${client.status === 'VIP' ? 'badge-warning' : 'badge-success'}`}>{client.status}</span></td>
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

export default ClientManagement;

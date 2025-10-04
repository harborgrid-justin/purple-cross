import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useClients } from '../../frontend/src/hooks/useClients';
import '../styles/Module.css';

const ClientManagement: React.FC = () => {
  const { data, isLoading, error } = useClients();

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
              {isLoading && <div className="loading">Loading clients...</div>}
              {error && <div className="error">Error loading clients: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && (
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
                      {data.data?.map((client: any) => (
                        <tr key={client.id}>
                          <td>{client.id}</td>
                          <td>{client.firstName} {client.lastName}</td>
                          <td>{client.email}</td>
                          <td>{client.phone}</td>
                          <td>{client.patients?.length || 0}</td>
                          <td><span className="badge badge-success">Active</span></td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Edit</button>
                          </td>
                        </tr>
                      )) || <tr><td colSpan={7}>No clients found</td></tr>}
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

export default ClientManagement;

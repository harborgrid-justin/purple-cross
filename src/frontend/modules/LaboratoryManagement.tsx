import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useLabTests } from '../../frontend/src/hooks/useLabTests';
import '../styles/Module.css';

const LaboratoryManagement: React.FC = () => {
  const { data, isLoading, error } = useLabTests();

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
              {isLoading && <div className="loading">Loading lab tests...</div>}
              {error && <div className="error">Error loading lab tests: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && data.data && data.data.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Test ID</th>
                        <th>Patient</th>
                        <th>Test Type</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Results</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((test: any) => (
                        <tr key={test.id}>
                          <td>{test.testNumber || test.id}</td>
                          <td>{test.patient?.name}</td>
                          <td>{test.testType?.name || test.testName}</td>
                          <td>{new Date(test.orderDate || test.createdAt).toLocaleDateString()}</td>
                          <td><span className={`badge badge-${test.status === 'completed' ? 'success' : test.status === 'pending' ? 'warning' : 'info'}`}>{test.status}</span></td>
                          <td>{test.status === 'completed' ? 'Available' : 'Pending'}</td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Results</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
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
              )}
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default LaboratoryManagement;

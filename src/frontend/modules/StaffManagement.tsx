import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useStaff } from '../../frontend/src/hooks/useStaff';
import '../styles/Module.css';

const StaffManagement: React.FC = () => {
  const { data, isLoading, error } = useStaff();

  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Staff & User Management</h1>
              <button className="btn-primary">Add Employee</button>
            </div>

            <div className="module-nav">
              <Link to="/staff" className="tab-link active">Employee Profiles</Link>
              <Link to="/staff/access-control" className="tab-link">Access Control</Link>
              <Link to="/staff/scheduling" className="tab-link">Shift Scheduling</Link>
              <Link to="/staff/time-attendance" className="tab-link">Time & Attendance</Link>
              <Link to="/staff/performance" className="tab-link">Performance</Link>
              <Link to="/staff/education" className="tab-link">Education</Link>
              <Link to="/staff/communication" className="tab-link">Communication</Link>
              <Link to="/staff/hr-docs" className="tab-link">HR Documents</Link>
            </div>

            <div className="content-section">
              {isLoading && <div className="loading">Loading staff...</div>}
              {error && <div className="error">Error loading staff: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && data.data && data.data.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((staff: any) => (
                        <tr key={staff.id}>
                          <td>{staff.employeeId || staff.id}</td>
                          <td>{staff.firstName} {staff.lastName}</td>
                          <td>{staff.role?.name || staff.roleType}</td>
                          <td>{staff.email}</td>
                          <td>{staff.phone}</td>
                          <td><span className={`badge badge-${staff.status === 'active' ? 'success' : 'secondary'}`}>{staff.status}</span></td>
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
                    <h3>Employee Management</h3>
                    <p>Complete HR and staff administration</p>
                    <ul>
                      <li>Employee profiles & credentials</li>
                      <li>Role-based access control</li>
                      <li>Shift scheduling & swaps</li>
                      <li>Time tracking & payroll</li>
                    </ul>
                  </div>
                  <div className="info-card">
                    <h3>Performance & Development</h3>
                    <p>Staff performance and training</p>
                    <ul>
                      <li>Performance reviews</li>
                      <li>Goal tracking</li>
                      <li>CE credit management</li>
                      <li>Internal messaging</li>
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

export default StaffManagement;

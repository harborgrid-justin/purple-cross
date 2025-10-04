import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAppointments } from '../../frontend/src/hooks/useAppointments';
import '../styles/Module.css';

const AppointmentScheduling: React.FC = () => {
  const { data, isLoading, error } = useAppointments();

  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Appointment Scheduling</h1>
              <button className="btn-primary">Book Appointment</button>
            </div>

            <div className="module-nav">
              <Link to="/appointments" className="tab-link active">Calendar</Link>
              <Link to="/appointments/booking" className="tab-link">Booking</Link>
              <Link to="/appointments/types" className="tab-link">Appointment Types</Link>
              <Link to="/appointments/waitlist" className="tab-link">Waitlist</Link>
              <Link to="/appointments/analytics" className="tab-link">Analytics</Link>
            </div>

            <div className="content-section">
              {isLoading && <div className="loading">Loading appointments...</div>}
              {error && <div className="error">Error loading appointments: {error instanceof Error ? error.message : 'Unknown error'}</div>}
              
              {data && (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Owner</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data?.map((apt: any) => (
                        <tr key={apt.id}>
                          <td>{apt.id}</td>
                          <td>{apt.patient?.name || 'N/A'}</td>
                          <td>{apt.client?.firstName} {apt.client?.lastName}</td>
                          <td>{apt.appointmentType?.name || apt.type || 'General'}</td>
                          <td>{new Date(apt.scheduledDate || apt.date).toLocaleDateString()}</td>
                          <td>{apt.scheduledTime || apt.time}</td>
                          <td><span className="badge badge-info">{apt.status}</span></td>
                          <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small">Edit</button>
                            <button className="btn-small">Cancel</button>
                          </td>
                        </tr>
                      )) || <tr><td colSpan={8}>No appointments found</td></tr>}
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

export default AppointmentScheduling;

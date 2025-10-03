import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const AppointmentScheduling: React.FC = () => {
  const [appointments] = useState([
    { id: '1', patient: 'Max', owner: 'John Smith', type: 'Checkup', date: '2024-01-15', time: '09:00 AM', status: 'Scheduled' },
    { id: '2', patient: 'Luna', owner: 'Sarah Johnson', type: 'Vaccination', date: '2024-01-15', time: '10:00 AM', status: 'Confirmed' },
    { id: '3', patient: 'Charlie', owner: 'Mike Wilson', type: 'Surgery', date: '2024-01-15', time: '02:00 PM', status: 'Scheduled' },
  ]);

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
                    {appointments.map((apt) => (
                      <tr key={apt.id}>
                        <td>{apt.id}</td>
                        <td>{apt.patient}</td>
                        <td>{apt.owner}</td>
                        <td>{apt.type}</td>
                        <td>{apt.date}</td>
                        <td>{apt.time}</td>
                        <td><span className="badge badge-info">{apt.status}</span></td>
                        <td>
                          <button className="btn-small">View</button>
                          <button className="btn-small">Edit</button>
                          <button className="btn-small">Cancel</button>
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

export default AppointmentScheduling;

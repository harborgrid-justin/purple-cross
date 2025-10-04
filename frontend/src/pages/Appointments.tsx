import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Page.css';

interface Appointment {
  id: string;
  appointmentType: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
  patient: {
    id: string;
    name: string;
    species: string;
  };
  client: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  veterinarian: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await api.appointments.getAll({
          limit: 50,
        }) as { status: string; data: Appointment[] };
        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h1><span aria-hidden="true">📅</span> Appointments</h1>
        <button className="btn-primary" aria-label="Schedule a new appointment">
          + Schedule Appointment
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Appointment sections">
        <Link to="/appointments" className="sub-nav-link active">Calendar</Link>
        <Link to="/appointments/booking" className="sub-nav-link">Booking</Link>
        <Link to="/appointments/calendar-management" className="sub-nav-link">Calendar Management</Link>
        <Link to="/appointments/types" className="sub-nav-link">Types & Duration</Link>
        <Link to="/appointments/waitlist" className="sub-nav-link">Waitlist</Link>
        <Link to="/appointments/reminders" className="sub-nav-link">Reminder System</Link>
        <Link to="/appointments/optimization" className="sub-nav-link">Schedule Optimization</Link>
        <Link to="/appointments/time-blocks" className="sub-nav-link">Time Block Management</Link>
        <Link to="/appointments/analytics" className="sub-nav-link">Analytics</Link>
      </nav>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No appointments found. Schedule a new appointment to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Appointments list">
            <thead>
              <tr>
                <th scope="col">Date & Time</th>
                <th scope="col">Patient</th>
                <th scope="col">Client</th>
                <th scope="col">Type</th>
                <th scope="col">Veterinarian</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <th scope="row">
                    <time dateTime={appointment.startTime}>
                      {new Date(appointment.startTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </time>
                  </th>
                  <td>
                    {appointment.patient.name} ({appointment.patient.species})
                  </td>
                  <td>
                    {appointment.client.firstName} {appointment.client.lastName}
                  </td>
                  <td>{appointment.appointmentType}</td>
                  <td>
                    Dr. {appointment.veterinarian.firstName} {appointment.veterinarian.lastName}
                  </td>
                  <td>
                    <span 
                      className={`status-badge status-${appointment.status}`}
                      role="status"
                      aria-label={`Status: ${appointment.status}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-action" 
                      aria-label={`View appointment for ${appointment.patient.name} on ${new Date(appointment.startTime).toLocaleDateString()}`}
                    >
                      View
                    </button>
                    <button 
                      className="btn-action" 
                      aria-label={`Edit appointment for ${appointment.patient.name} on ${new Date(appointment.startTime).toLocaleDateString()}`}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Appointments;

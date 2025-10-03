import { useState, useEffect } from 'react';
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
      <div className="page-header">
        <h1>📅 Appointments</h1>
        <button className="btn-primary">+ Schedule Appointment</button>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found. Schedule a new appointment to get started.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient</th>
                <th>Client</th>
                <th>Type</th>
                <th>Veterinarian</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    {new Date(appointment.startTime).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </td>
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
                    <span className={`status-badge status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action">View</button>
                    <button className="btn-action">Edit</button>
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

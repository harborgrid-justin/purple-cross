/**
 * WF-COMP-032 | AppointmentsMain.tsx - Main appointments page
 * Purpose: Main appointments list and navigation page
 * Related: AppointmentsList component, appointments routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import { useState, useEffect, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/Page.css';

// Lazy load subfeature pages
const Booking = lazy(() => import('./Booking'));
const CalendarManagement = lazy(() => import('./CalendarManagement'));
const Types = lazy(() => import('./Types'));
const Waitlist = lazy(() => import('./Waitlist'));
const Reminders = lazy(() => import('./Reminders'));
const Optimization = lazy(() => import('./Optimization'));
const TimeBlocks = lazy(() => import('./TimeBlocks'));
const Analytics = lazy(() => import('./Analytics'));

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

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = (await api.appointments.getAll({
          limit: 50,
        })) as { status: string; data: Appointment[] };
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAppointments(appointments);
      return;
    }

    const filtered = appointments.filter((appointment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        appointment.patient.name.toLowerCase().includes(searchLower) ||
        appointment.client.firstName.toLowerCase().includes(searchLower) ||
        appointment.client.lastName.toLowerCase().includes(searchLower) ||
        appointment.appointmentType.toLowerCase().includes(searchLower) ||
        appointment.status.toLowerCase().includes(searchLower)
      );
    });
    setFilteredAppointments(filtered);
  }, [searchTerm, appointments]);

  return (
    <div className="table-container">
      <div className="search-container" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          id="appointment-search"
          placeholder="Search appointments by patient, client, type, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
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
            {filteredAppointments.map((appointment) => (
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
  );
};

const AppointmentsMain = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📅</span> Appointments
        </h1>
        <button className="btn-primary" aria-label="Schedule a new appointment">
          + Schedule Appointment
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Appointment sections">
        <Link
          to="/appointments"
          className={`sub-nav-link ${location.pathname === '/appointments' ? 'active' : ''}`}
        >
          Calendar
        </Link>
        <Link
          to="/appointments/booking"
          className={`sub-nav-link ${location.pathname.includes('/booking') ? 'active' : ''}`}
        >
          Booking
        </Link>
        <Link
          to="/appointments/calendar-management"
          className={`sub-nav-link ${location.pathname.includes('/calendar-management') ? 'active' : ''}`}
        >
          Calendar Management
        </Link>
        <Link
          to="/appointments/types"
          className={`sub-nav-link ${location.pathname.includes('/types') ? 'active' : ''}`}
        >
          Types & Duration
        </Link>
        <Link
          to="/appointments/waitlist"
          className={`sub-nav-link ${location.pathname.includes('/waitlist') ? 'active' : ''}`}
        >
          Waitlist
        </Link>
        <Link
          to="/appointments/reminders"
          className={`sub-nav-link ${location.pathname.includes('/reminders') ? 'active' : ''}`}
        >
          Reminder System
        </Link>
        <Link
          to="/appointments/optimization"
          className={`sub-nav-link ${location.pathname.includes('/optimization') ? 'active' : ''}`}
        >
          Schedule Optimization
        </Link>
        <Link
          to="/appointments/time-blocks"
          className={`sub-nav-link ${location.pathname.includes('/time-blocks') ? 'active' : ''}`}
        >
          Time Block Management
        </Link>
        <Link
          to="/appointments/analytics"
          className={`sub-nav-link ${location.pathname.includes('/analytics') ? 'active' : ''}`}
        >
          Analytics
        </Link>
      </nav>

      <Suspense
        fallback={
          <div role="status">
            <p>Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<AppointmentsList />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/calendar-management" element={<CalendarManagement />} />
          <Route path="/types" element={<Types />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/optimization" element={<Optimization />} />
          <Route path="/time-blocks" element={<TimeBlocks />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppointmentsMain;

/**
 * WF-COMP-XXX | CalendarManagement.tsx - Calendar Management
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for CalendarManagement functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../hooks/useAppointments';
import '../../styles/Page.css';

interface AppointmentRow {
  id: string;
  appointmentType: string;
  startTime: string;
  endTime: string;
  status: string;
  patient?: { name: string; species: string };
  client?: { firstName: string; lastName: string };
}

const today = (): string => new Date().toISOString().split('T')[0];

const CalendarManagement = () => {
  const [date, setDate] = useState(today());

  const { data, isLoading, isError } = useAppointments({ date, limit: 100 });
  const appointments = (data as { data?: AppointmentRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Calendar Management</h1>
        <p className="page-subtitle">Review the daily schedule and manage appointments by date</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="calendar-date" className="sr-only">
          Select date
        </label>
        <input
          id="calendar-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Select date to view appointments"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading schedule...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load appointments. Please try again.</p>
          </div>
        ) : appointments.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No appointments scheduled for this date.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Daily schedule">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Patient</th>
                <th scope="col">Client</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <th scope="row">
                    <time dateTime={appt.startTime}>
                      {new Date(appt.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </time>
                  </th>
                  <td>{appt.patient ? `${appt.patient.name} (${appt.patient.species})` : 'N/A'}</td>
                  <td>
                    {appt.client ? `${appt.client.firstName} ${appt.client.lastName}` : 'N/A'}
                  </td>
                  <td>{appt.appointmentType}</td>
                  <td>
                    <span
                      className={`status-badge status-${appt.status}`}
                      role="status"
                      aria-label={`Status: ${appt.status}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/appointments/${appt.id}`}
                      className="btn-action"
                      aria-label={`View appointment for ${appt.patient?.name ?? 'patient'}`}
                    >
                      View
                    </Link>
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

export default CalendarManagement;

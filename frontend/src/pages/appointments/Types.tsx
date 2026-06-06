/**
 * WF-COMP-XXX | Types.tsx - Types
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Types functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../hooks/useAppointments';
import '../../styles/Page.css';

interface AppointmentRow {
  id: string;
  appointmentType: string;
  startTime: string;
  endTime: string;
  status: string;
  patient?: { name: string };
}

const durationMinutes = (start: string, end: string): number | null => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return null;
  return Math.round((e - s) / 60000);
};

const Types = () => {
  const [typeFilter, setTypeFilter] = useState('');
  const { data, isLoading, isError } = useAppointments({ limit: 100 });

  const allAppointments = useMemo<AppointmentRow[]>(
    () => (data as { data?: AppointmentRow[] } | undefined)?.data ?? [],
    [data]
  );

  const types = useMemo(
    () => Array.from(new Set(allAppointments.map((a) => a.appointmentType))).sort(),
    [allAppointments]
  );

  const appointments = typeFilter
    ? allAppointments.filter((a) => a.appointmentType === typeFilter)
    : allAppointments;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Appointment Types &amp; Duration</h1>
        <p className="page-subtitle">Review appointments by type and their scheduled durations</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="type-filter" className="sr-only">
          Filter by appointment type
        </label>
        <select
          id="type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by appointment type"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading appointment types...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load appointments. Please try again.</p>
          </div>
        ) : appointments.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No appointments found for this type.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Appointments by type">
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Patient</th>
                <th scope="col">Start</th>
                <th scope="col">Duration</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                const mins = durationMinutes(appt.startTime, appt.endTime);
                return (
                  <tr key={appt.id}>
                    <th scope="row">{appt.appointmentType}</th>
                    <td>{appt.patient?.name ?? 'N/A'}</td>
                    <td>
                      <time dateTime={appt.startTime}>
                        {new Date(appt.startTime).toLocaleString()}
                      </time>
                    </td>
                    <td>{mins !== null ? `${mins} min` : 'N/A'}</td>
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Types;

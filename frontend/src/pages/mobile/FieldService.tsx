/**
 * WF-COMP-XXX | FieldService.tsx - Field Service
 * Purpose: API service for Fieldx endpoints and operations
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import '../../styles/Page.css';

interface AppointmentRow {
  id: string;
  startTime?: string;
  reason?: string;
  status?: string;
  patient?: { name: string };
}

const FieldService = () => {
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const { data, isLoading, isError } = useAppointments({ date, limit: 50 });
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const appointments = (data as { data?: AppointmentRow[] } | undefined)?.data ?? [];

  const handleMarkVisited = (id: string): void => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Field Service</h1>
      </header>
      <p className="page-subtitle">Manage mobile and house-call appointments for the day.</p>

      <div className="search-bar" role="search">
        <div className="form-group">
          <label htmlFor="field-date">Service Date</label>
          <input
            id="field-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading appointments…</p>
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
          <table className="data-table" role="table" aria-label="Field service appointments">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Patient</th>
                <th scope="col">Reason</th>
                <th scope="col">Visit Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <th scope="row">
                    {appt.startTime ? new Date(appt.startTime).toLocaleTimeString() : 'N/A'}
                  </th>
                  <td>{appt.patient?.name ?? 'Unknown'}</td>
                  <td>{appt.reason ?? 'N/A'}</td>
                  <td>
                    <span
                      className={`status-badge status-${completed[appt.id] ? 'confirmed' : 'pending'}`}
                      role="status"
                    >
                      {completed[appt.id] ? 'Visited' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleMarkVisited(appt.id)}
                      aria-label={`Toggle visit status for ${appt.patient?.name ?? 'appointment'}`}
                    >
                      {completed[appt.id] ? 'Undo' : 'Mark Visited'}
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

export default FieldService;

/**
 * WF-COMP-XXX | Optimization.tsx - Optimization
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Optimization functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useMemo } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import '../../styles/Page.css';

interface AppointmentRow {
  id: string;
  status: string;
  startTime: string;
}

const OptimizationView = () => {
  const { data, isLoading, isError } = useAppointments({ limit: 100 });
  const appointments = (data as { data?: AppointmentRow[] } | undefined)?.data ?? [];

  const statusBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of appointments) {
      counts.set(a.status, (counts.get(a.status) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [appointments]);

  const hourBreakdown = useMemo(() => {
    const counts = new Map<number, number>();
    for (const a of appointments) {
      const hour = new Date(a.startTime).getHours();
      if (!Number.isNaN(hour)) counts.set(hour, (counts.get(hour) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => a[0] - b[0]);
  }, [appointments]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Schedule Optimization</h1>
        <p className="page-subtitle">Identify load distribution and peak times across appointments</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Analyzing schedule...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load appointment data. Please try again.</p>
          </div>
        ) : appointments.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No appointment data to analyze.</p>
          </div>
        ) : (
          <>
            <table className="data-table" role="table" aria-label="Appointments by status">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Count</th>
                  <th scope="col">Share</th>
                </tr>
              </thead>
              <tbody>
                {statusBreakdown.map(([status, count]) => (
                  <tr key={status}>
                    <th scope="row">{status}</th>
                    <td>{count}</td>
                    <td>{Math.round((count / appointments.length) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table
              className="data-table"
              role="table"
              aria-label="Appointments by hour"
              style={{ marginTop: '2rem' }}
            >
              <thead>
                <tr>
                  <th scope="col">Hour</th>
                  <th scope="col">Appointments</th>
                </tr>
              </thead>
              <tbody>
                {hourBreakdown.map(([hour, count]) => (
                  <tr key={hour}>
                    <th scope="row">
                      {hour.toString().padStart(2, '0')}:00 - {hour.toString().padStart(2, '0')}:59
                    </th>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default OptimizationView;

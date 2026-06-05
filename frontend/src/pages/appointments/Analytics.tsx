/**
 * WF-COMP-XXX | Analytics.tsx - Analytics
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Analytics functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useAppointmentAnalytics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface AppointmentAnalytics {
  total?: number;
  completed?: number;
  cancelled?: number;
  noShow?: number;
  byType?: Record<string, number>;
  byStatus?: Record<string, number>;
}

const Analytics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, isError } = useAppointmentAnalytics({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const analytics = (data as { data?: AppointmentAnalytics } | undefined)?.data;
  const byType = analytics?.byType
    ? Object.entries(analytics.byType).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Appointment Analytics</h1>
        <p className="page-subtitle">Booking, completion, and no-show metrics over time</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="analytics-start" className="sr-only">
          Start date
        </label>
        <input
          id="analytics-start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label="Analytics start date"
        />
        <label htmlFor="analytics-end" className="sr-only">
          End date
        </label>
        <input
          id="analytics-end"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label="Analytics end date"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading analytics...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load analytics. Please try again.</p>
          </div>
        ) : !analytics ? (
          <div role="status" aria-live="polite">
            <p>No analytics available for the selected period.</p>
          </div>
        ) : (
          <>
            <table className="data-table" role="table" aria-label="Appointment summary metrics">
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Total Appointments</th>
                  <td>{analytics.total ?? 0}</td>
                </tr>
                <tr>
                  <th scope="row">Completed</th>
                  <td>{analytics.completed ?? 0}</td>
                </tr>
                <tr>
                  <th scope="row">Cancelled</th>
                  <td>{analytics.cancelled ?? 0}</td>
                </tr>
                <tr>
                  <th scope="row">No-Show</th>
                  <td>{analytics.noShow ?? 0}</td>
                </tr>
              </tbody>
            </table>

            {byType.length > 0 && (
              <table
                className="data-table"
                role="table"
                aria-label="Appointments by type"
                style={{ marginTop: '2rem' }}
              >
                <thead>
                  <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {byType.map(([type, count]) => (
                    <tr key={type}>
                      <th scope="row">{type}</th>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;

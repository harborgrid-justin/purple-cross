/**
 * WF-COMP-XXX | Operational.tsx - Operational
 * Purpose: React component for Operational functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useAppointmentAnalytics, useStaffAnalytics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface AppointmentAnalytics {
  total?: number;
  completed?: number;
  cancelled?: number;
  noShow?: number;
  byStatus?: Array<{ status: string; count: number }>;
}

interface StaffAnalytics {
  byStaff?: Array<{ id: string; name: string; appointments: number; revenue?: number }>;
}

const Operational = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const apptQuery = useAppointmentAnalytics({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const staffQuery = useStaffAnalytics();

  const appts = (apptQuery.data as { data?: AppointmentAnalytics } | undefined)?.data ?? {};
  const staff = (staffQuery.data as { data?: StaffAnalytics } | undefined)?.data ?? {};
  const byStaff = staff.byStaff ?? [];

  const isLoading = apptQuery.isLoading || staffQuery.isLoading;
  const isError = apptQuery.isError || staffQuery.isError;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Operational Reports</h1>
      </header>
      <p className="page-subtitle">Appointment throughput and staff productivity.</p>

      <div className="search-bar" role="search">
        <div className="form-group">
          <label htmlFor="ops-start">Start Date</label>
          <input
            id="ops-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ops-end">End Date</label>
          <input
            id="ops-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading operational metrics…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load operational metrics. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                📅
              </span>
              <div className="stat-content">
                <div className="stat-label">Total Appointments</div>
                <div className="stat-value">{(appts.total ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                ✅
              </span>
              <div className="stat-content">
                <div className="stat-label">Completed</div>
                <div className="stat-value">{(appts.completed ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                ❌
              </span>
              <div className="stat-content">
                <div className="stat-label">Cancelled</div>
                <div className="stat-value">{(appts.cancelled ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                🚫
              </span>
              <div className="stat-content">
                <div className="stat-label">No-Shows</div>
                <div className="stat-value">{(appts.noShow ?? 0).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <h2>Staff Productivity</h2>
          <div className="table-container">
            {byStaff.length === 0 ? (
              <div role="status" aria-live="polite">
                <p>No staff productivity data available.</p>
              </div>
            ) : (
              <table className="data-table" role="table" aria-label="Staff productivity">
                <thead>
                  <tr>
                    <th scope="col">Staff Member</th>
                    <th scope="col">Appointments</th>
                    <th scope="col">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {byStaff.map((member) => (
                    <tr key={member.id}>
                      <th scope="row">{member.name}</th>
                      <td>{member.appointments.toLocaleString()}</td>
                      <td>
                        {typeof member.revenue === 'number'
                          ? member.revenue.toLocaleString(undefined, {
                              style: 'currency',
                              currency: 'USD',
                            })
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Operational;

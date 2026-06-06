/**
 * WF-COMP-XXX | Attendance.tsx - Attendance
 * Purpose: React component for Attendance functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useStaff } from '../../hooks/useStaff';
import '../../styles/Page.css';

interface AttendanceRow {
  id: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  employmentType?: string;
  status?: string;
}

const STATUS_OPTIONS = ['active', 'inactive', 'on-leave'];

const Attendance = () => {
  const [status, setStatus] = useState('');
  const { data, isLoading, isError } = useStaff({ limit: 50, status: status || undefined });

  const staff = (data as { data?: AttendanceRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Time &amp; Attendance</h1>
        <p className="page-subtitle">Staff roster by availability status</p>
      </header>

      <div className="form-group" style={{ maxWidth: '20rem' }}>
        <label htmlFor="attendance-status-filter">Filter by status</label>
        <select
          id="attendance-status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading attendance roster...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load attendance roster. Please try again.</p>
          </div>
        ) : staff.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No staff found for this status.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Attendance roster">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Employment Type</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <th scope="row">
                    {member.firstName ?? ''} {member.lastName ?? ''}
                  </th>
                  <td>{member.role ?? 'N/A'}</td>
                  <td>{member.employmentType ?? 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${member.status ?? 'active'}`}>
                      {member.status ?? 'active'}
                    </span>
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

export default Attendance;

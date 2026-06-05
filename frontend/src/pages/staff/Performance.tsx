/**
 * WF-COMP-XXX | Performance.tsx - Performance
 * Purpose: React component for Performance functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useStaff } from '../../hooks/useStaff';
import '../../styles/Page.css';

interface PerformanceRow {
  id: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  specialization?: string;
  hireDate?: string;
  status?: string;
}

const tenureYears = (hireDate?: string): string => {
  if (!hireDate) return 'N/A';
  const start = new Date(hireDate).getTime();
  if (Number.isNaN(start)) return 'N/A';
  const years = (Date.now() - start) / (1000 * 60 * 60 * 24 * 365.25);
  return `${years.toFixed(1)} yrs`;
};

const Performance = () => {
  const { data, isLoading, isError } = useStaff({ limit: 50, status: 'active' });

  const staff = (data as { data?: PerformanceRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Performance Management</h1>
        <p className="page-subtitle">Active staff, roles, and tenure</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading performance data...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load performance data. Please try again.</p>
          </div>
        ) : staff.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No active staff found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Performance management">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Specialization</th>
                <th scope="col">Hire Date</th>
                <th scope="col">Tenure</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <th scope="row">
                    {member.firstName ?? ''} {member.lastName ?? ''}
                  </th>
                  <td>{member.role ?? 'N/A'}</td>
                  <td>{member.specialization ?? 'N/A'}</td>
                  <td>
                    {member.hireDate ? (
                      <time dateTime={member.hireDate}>
                        {new Date(member.hireDate).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{tenureYears(member.hireDate)}</td>
                  <td>
                    <Link
                      to={`/staff/${member.id}`}
                      className="btn-action"
                      aria-label={`View performance for ${member.firstName ?? ''} ${member.lastName ?? ''}`}
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

export default Performance;

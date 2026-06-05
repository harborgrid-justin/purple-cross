/**
 * WF-COMP-XXX | AccessControl.tsx - Access Control
 * Purpose: React component for AccessControl functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaff } from '../../hooks/useStaff';
import '../../styles/Page.css';

interface AccessRow {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
}

const ROLE_OPTIONS = ['veterinarian', 'technician', 'receptionist', 'admin', 'manager'];

const AccessControl = () => {
  const [role, setRole] = useState('');
  const { data, isLoading, isError } = useStaff({ limit: 50, role: role || undefined });

  const staff = (data as { data?: AccessRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Access Control</h1>
        <p className="page-subtitle">Roles and access levels by staff member</p>
      </header>

      <div className="form-group" style={{ maxWidth: '20rem' }}>
        <label htmlFor="access-role-filter">Filter by role</label>
        <select
          id="access-role-filter"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading access control...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load access control. Please try again.</p>
          </div>
        ) : staff.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No staff members found for this role.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Access control">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Account Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <th scope="row">
                    {member.firstName ?? ''} {member.lastName ?? ''}
                  </th>
                  <td>{member.email ?? 'N/A'}</td>
                  <td>{member.role ?? 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${member.status ?? 'active'}`}>
                      {member.status ?? 'active'}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/staff/${member.id}`}
                      className="btn-action"
                      aria-label={`Manage access for ${member.firstName ?? ''} ${member.lastName ?? ''}`}
                    >
                      Manage
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

export default AccessControl;

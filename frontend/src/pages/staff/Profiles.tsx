/**
 * WF-COMP-XXX | Profiles.tsx - Profiles
 * Purpose: React component for Profiles functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaff } from '../../hooks/useStaff';
import '../../styles/Page.css';

interface StaffProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  specialization?: string;
  employmentType?: string;
  status?: string;
}

const Profiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useStaff({ limit: 50 });

  const staff = (data as { data?: StaffProfile[] } | undefined)?.data ?? [];

  const searchLower = searchTerm.toLowerCase();
  const filtered = searchTerm
    ? staff.filter(
        (m) =>
          `${m.firstName ?? ''} ${m.lastName ?? ''}`.toLowerCase().includes(searchLower) ||
          (m.email ?? '').toLowerCase().includes(searchLower) ||
          (m.role ?? '').toLowerCase().includes(searchLower)
      )
    : staff;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Employee Profiles</h1>
        <p className="page-subtitle">Comprehensive employee information</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="profiles-search" className="sr-only">
          Search employee profiles
        </label>
        <input
          id="profiles-search"
          type="search"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search employee profiles"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading employee profiles...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load employee profiles. Please try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No employees found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Employee profiles">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Specialization</th>
                <th scope="col">Employment</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id}>
                  <th scope="row">
                    {member.firstName ?? ''} {member.lastName ?? ''}
                  </th>
                  <td>{member.email ?? 'N/A'}</td>
                  <td>{member.role ?? 'N/A'}</td>
                  <td>{member.specialization ?? 'N/A'}</td>
                  <td>{member.employmentType ?? 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${member.status ?? 'active'}`}>
                      {member.status ?? 'active'}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/staff/${member.id}`}
                      className="btn-action"
                      aria-label={`View profile for ${member.firstName ?? ''} ${member.lastName ?? ''}`}
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

export default Profiles;

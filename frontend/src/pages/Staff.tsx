/**
 * WF-COMP-XXX | Staff.tsx - Staff
 * Purpose: React component for Staff functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useStaff } from '../hooks/useStaff';
import '../styles/Page.css';

// Lazy load subfeature pages
const Profiles = lazy(() => import('./staff/Profiles'));
const AccessControl = lazy(() => import('./staff/AccessControl'));
const Scheduling = lazy(() => import('./staff/Scheduling'));
const Attendance = lazy(() => import('./staff/Attendance'));
const Performance = lazy(() => import('./staff/Performance'));
const Education = lazy(() => import('./staff/Education'));
const Communication = lazy(() => import('./staff/Communication'));
const HRDocuments = lazy(() => import('./staff/HRDocuments'));
const StaffCreate = lazy(() => import('./staff/StaffCreate'));
const StaffDetail = lazy(() => import('./staff/StaffDetail'));
const StaffEdit = lazy(() => import('./staff/StaffEdit'));

interface StaffMember {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  department?: string;
  phone?: string;
}

const StaffList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading: loading, isError } = useStaff({ limit: 50 });

  const staff = (data as { data?: StaffMember[] } | undefined)?.data ?? [];

  const searchLower = searchTerm.toLowerCase();
  const filteredStaff = searchTerm
    ? staff.filter(
        (member) =>
          `${member.firstName ?? ''} ${member.lastName ?? ''}`
            .toLowerCase()
            .includes(searchLower) ||
          (member.email ?? '').toLowerCase().includes(searchLower) ||
          (member.role ?? '').toLowerCase().includes(searchLower)
      )
    : staff;

  return (
    <div className="table-container">
      <div className="search-bar" role="search">
        <label htmlFor="staff-search" className="sr-only">
          Search staff
        </label>
        <input
          id="staff-search"
          type="search"
          placeholder="Search staff by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search staff by name, email, or role"
        />
      </div>
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading staff...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load staff. Please try again.</p>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No staff members found. Add a staff member to get started.</p>
        </div>
      ) : (
        <table className="data-table" role="table" aria-label="Staff list">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Phone</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member) => (
              <tr key={member.id}>
                <th scope="row">
                  {member.firstName ?? ''} {member.lastName ?? ''}
                </th>
                <td>{member.email ?? 'N/A'}</td>
                <td>{member.role ?? 'N/A'}</td>
                <td>{member.phone ?? 'N/A'}</td>
                <td>
                  <Link
                    to={`/staff/${member.id}`}
                    className="btn-action"
                    aria-label={`View profile for ${member.firstName ?? ''} ${member.lastName ?? ''}`}
                  >
                    View
                  </Link>
                  <Link
                    to={`/staff/${member.id}/edit`}
                    className="btn-action"
                    aria-label={`Edit information for ${member.firstName ?? ''} ${member.lastName ?? ''}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Staff = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👨‍⚕️</span> Staff Management
        </h1>
        <Link to="/staff/create" className="btn-primary" aria-label="Add new staff member">
          + Add Staff
        </Link>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Staff sections">
        <Link
          to="/staff"
          className={`sub-nav-link ${location.pathname === '/staff' ? 'active' : ''}`}
        >
          All Staff
        </Link>
        <Link
          to="/staff/profiles"
          className={`sub-nav-link ${location.pathname.includes('/profiles') ? 'active' : ''}`}
        >
          Employee Profiles
        </Link>
        <Link
          to="/staff/access-control"
          className={`sub-nav-link ${location.pathname.includes('/access-control') ? 'active' : ''}`}
        >
          Access Control
        </Link>
        <Link
          to="/staff/scheduling"
          className={`sub-nav-link ${location.pathname.includes('/scheduling') ? 'active' : ''}`}
        >
          Shift Scheduling
        </Link>
        <Link
          to="/staff/attendance"
          className={`sub-nav-link ${location.pathname.includes('/attendance') ? 'active' : ''}`}
        >
          Time &amp; Attendance
        </Link>
        <Link
          to="/staff/performance"
          className={`sub-nav-link ${location.pathname.includes('/performance') ? 'active' : ''}`}
        >
          Performance Management
        </Link>
        <Link
          to="/staff/education"
          className={`sub-nav-link ${location.pathname.includes('/education') ? 'active' : ''}`}
        >
          Continuing Education
        </Link>
        <Link
          to="/staff/communication"
          className={`sub-nav-link ${location.pathname.includes('/communication') ? 'active' : ''}`}
        >
          Internal Communication
        </Link>
        <Link
          to="/staff/hr-documents"
          className={`sub-nav-link ${location.pathname.includes('/hr-documents') ? 'active' : ''}`}
        >
          HR Documents
        </Link>
      </nav>

      <Suspense
        fallback={
          <div role="status">
            <p>Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<StaffList />} />
          <Route path="/create" element={<StaffCreate />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/access-control" element={<AccessControl />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/education" element={<Education />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/hr-documents" element={<HRDocuments />} />
          <Route path="/:id/edit" element={<StaffEdit />} />
          <Route path="/:id" element={<StaffDetail />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Staff;

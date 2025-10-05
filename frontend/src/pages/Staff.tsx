import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
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

const StaffList = () => {
  const [staff] = useState([
    {
      id: '1',
      name: 'Dr. Emily Smith',
      role: 'Veterinarian',
      department: 'Surgery',
      status: 'Active',
    },
    { id: '2', name: 'John Doe', role: 'Vet Tech', department: 'General Care', status: 'Active' },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Staff list">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Department</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id}>
              <th scope="row">{member.name}</th>
              <td>{member.role}</td>
              <td>{member.department}</td>
              <td>
                <span className="status-badge status-confirmed">
                  {member.status}
                </span>
              </td>
              <td>
                <button className="btn-action" aria-label={`View profile for ${member.name}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Edit information for ${member.name}`}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        <button className="btn-primary" aria-label="Add new staff member">
          + Add Staff
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Staff sections">
        <Link to="/staff" className={`sub-nav-link ${location.pathname === '/staff' ? 'active' : ''}`}>All Staff</Link>
        <Link to="/staff/profiles" className={`sub-nav-link ${location.pathname.includes('/profiles') ? 'active' : ''}`}>Employee Profiles</Link>
        <Link to="/staff/access-control" className={`sub-nav-link ${location.pathname.includes('/access-control') ? 'active' : ''}`}>Access Control</Link>
        <Link to="/staff/scheduling" className={`sub-nav-link ${location.pathname.includes('/scheduling') ? 'active' : ''}`}>Shift Scheduling</Link>
        <Link to="/staff/attendance" className={`sub-nav-link ${location.pathname.includes('/attendance') ? 'active' : ''}`}>Time & Attendance</Link>
        <Link to="/staff/performance" className={`sub-nav-link ${location.pathname.includes('/performance') ? 'active' : ''}`}>Performance Management</Link>
        <Link to="/staff/education" className={`sub-nav-link ${location.pathname.includes('/education') ? 'active' : ''}`}>Continuing Education</Link>
        <Link to="/staff/communication" className={`sub-nav-link ${location.pathname.includes('/communication') ? 'active' : ''}`}>Internal Communication</Link>
        <Link to="/staff/hr-documents" className={`sub-nav-link ${location.pathname.includes('/hr-documents') ? 'active' : ''}`}>HR Documents</Link>
      </nav>

      <Suspense fallback={<div role="status"><p>Loading...</p></div>}>
        <Routes>
          <Route path="/" element={<StaffList />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/access-control" element={<AccessControl />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/education" element={<Education />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/hr-documents" element={<HRDocuments />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Staff;

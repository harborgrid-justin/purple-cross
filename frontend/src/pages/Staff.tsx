import { useState, useEffect, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import api from '../services/api';
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

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
}

const StaffList = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const response = (await api.staff.getAll({
          limit: 50,
        })) as { status: string; data: StaffMember[] };
        setStaff(response.data);
        setFilteredStaff(response.data);
      } catch (err) {
        console.error('Error fetching staff:', err);
        setStaff([]);
        setFilteredStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStaff(staff);
      return;
    }

    const filtered = staff.filter((member) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        member.firstName.toLowerCase().includes(searchLower) ||
        member.lastName.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        (member.role && member.role.toLowerCase().includes(searchLower)) ||
        (member.department && member.department.toLowerCase().includes(searchLower))
      );
    });
    setFilteredStaff(filtered);
  }, [searchTerm, staff]);

  return (
    <div className="table-container">
      <div className="search-container" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          id="staff-search"
          placeholder="Search staff by name, email, role, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading staff...</p>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No staff members found.</p>
        </div>
      ) : (
        <table className="data-table" role="table" aria-label="Staff list">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Department</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((member) => (
            <tr key={member.id}>
              <th scope="row">{member.firstName} {member.lastName}</th>
              <td>{member.email}</td>
              <td>{member.role || 'N/A'}</td>
              <td>{member.department || 'N/A'}</td>
              <td>
                <button className="btn-action" aria-label={`View profile for ${member.firstName} ${member.lastName}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Edit information for ${member.firstName} ${member.lastName}`}>
                  Edit
                </button>
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
        <button className="btn-primary" aria-label="Add new staff member">
          + Add Staff
        </button>
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
          Time & Attendance
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

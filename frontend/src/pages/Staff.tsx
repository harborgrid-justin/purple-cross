import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Staff = () => {
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
        <Link to="/staff" className="sub-nav-link active">
          All Staff
        </Link>
        <Link to="/staff/profiles" className="sub-nav-link">
          Employee Profiles
        </Link>
        <Link to="/staff/access-control" className="sub-nav-link">
          Access Control
        </Link>
        <Link to="/staff/scheduling" className="sub-nav-link">
          Shift Scheduling
        </Link>
        <Link to="/staff/attendance" className="sub-nav-link">
          Time & Attendance
        </Link>
        <Link to="/staff/performance" className="sub-nav-link">
          Performance Management
        </Link>
        <Link to="/staff/education" className="sub-nav-link">
          Continuing Education
        </Link>
        <Link to="/staff/communication" className="sub-nav-link">
          Internal Communication
        </Link>
        <Link to="/staff/hr-documents" className="sub-nav-link">
          HR Documents
        </Link>
      </nav>

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
                  <span className="status-badge status-confirmed">{member.status}</span>
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
    </div>
  );
};

export default Staff;

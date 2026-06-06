/**
 * WF-COMP-XXX | Education.tsx - Education
 * Purpose: React component for Education functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useStaff } from '../../hooks/useStaff';
import '../../styles/Page.css';

interface EducationRow {
  id: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  specialization?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
}

const Education = () => {
  const { data, isLoading, isError } = useStaff({ limit: 50 });

  const staff = (data as { data?: EducationRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Continuing Education</h1>
        <p className="page-subtitle">Credentials, licenses, and specializations</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading credentials...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load credentials. Please try again.</p>
          </div>
        ) : staff.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No staff credentials found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Staff credentials">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Specialization</th>
                <th scope="col">License #</th>
                <th scope="col">License Expiry</th>
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
                  <td>{member.licenseNumber ?? 'N/A'}</td>
                  <td>
                    {member.licenseExpiry ? (
                      <time dateTime={member.licenseExpiry}>
                        {new Date(member.licenseExpiry).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
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

export default Education;

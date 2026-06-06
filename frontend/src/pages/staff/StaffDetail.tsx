/**
 * WF-COMP-STAFF-004 | StaffDetail.tsx - Staff detail page
 * Purpose: Display detailed information for a single staff
 * Related: Staff details component, staff store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStaffMember } from '../../hooks/useStaff';
import '../../styles/Page.css';

interface StaffMemberDetail {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  specialization?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  employmentType?: string;
  hireDate?: string;
  status?: string;
}

const fmtDate = (value?: string): string => (value ? new Date(value).toLocaleDateString() : 'N/A');

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useStaffMember(id || '');
  const member = (data as { data?: StaffMemberDetail } | undefined)?.data;

  if (isLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading staff member...</p>
        </div>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Staff member not found</p>
        </div>
        <Link to="/staff" className="btn-secondary">
          Back to Staff
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👨‍⚕️</span> {member.firstName ?? ''} {member.lastName ?? ''}
        </h1>
        <div>
          <Link to={`/staff/${member.id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/staff" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <div className="detail-grid">
          <div className="detail-section">
            <h2>Contact</h2>
            <dl>
              <dt>Email:</dt>
              <dd>{member.email ?? 'N/A'}</dd>
              <dt>Phone:</dt>
              <dd>{member.phone ?? 'N/A'}</dd>
            </dl>
          </div>

          <div className="detail-section">
            <h2>Role &amp; Credentials</h2>
            <dl>
              <dt>Role:</dt>
              <dd>{member.role ?? 'N/A'}</dd>
              <dt>Specialization:</dt>
              <dd>{member.specialization ?? 'N/A'}</dd>
              <dt>License #:</dt>
              <dd>{member.licenseNumber ?? 'N/A'}</dd>
              <dt>License Expiry:</dt>
              <dd>{fmtDate(member.licenseExpiry)}</dd>
            </dl>
          </div>

          <div className="detail-section">
            <h2>Employment</h2>
            <dl>
              <dt>Employment Type:</dt>
              <dd>{member.employmentType ?? 'N/A'}</dd>
              <dt>Hire Date:</dt>
              <dd>{fmtDate(member.hireDate)}</dd>
              <dt>Status:</dt>
              <dd>{member.status ?? 'N/A'}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;

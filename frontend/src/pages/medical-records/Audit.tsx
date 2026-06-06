/**
 * WF-COMP-XXX | Audit.tsx - Audit
 * Purpose: React component for Audit functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import '../../styles/Page.css';

interface AuditRecord {
  id: string;
  chiefComplaint?: string;
  patient?: { id: string; name: string };
  updatedBy?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

const AUDIT_LIMIT = 50;

const Audit = () => {
  const { data, isLoading, isError } = useMedicalRecords({ limit: AUDIT_LIMIT });

  const records = (data as { data?: AuditRecord[] } | undefined)?.data ?? [];

  // Most-recently-modified first: present medical records as a change history.
  const sorted = [...records].sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div className="page">
      <header className="page-header">
        <h1>Audit Trail</h1>
        <p className="page-subtitle">Medical record change history (most recent first)</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading audit trail...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load audit trail. Please try again.</p>
          </div>
        ) : sorted.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No audit entries found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Audit trail">
            <thead>
              <tr>
                <th scope="col">Last Modified</th>
                <th scope="col">Patient</th>
                <th scope="col">Chief Complaint</th>
                <th scope="col">Version</th>
                <th scope="col">Modified By</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((record) => (
                <tr key={record.id}>
                  <th scope="row">
                    {record.updatedAt ? (
                      <time dateTime={record.updatedAt}>
                        {new Date(record.updatedAt).toLocaleString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </th>
                  <td>{record.patient?.name ?? 'Unknown'}</td>
                  <td>{record.chiefComplaint ?? 'N/A'}</td>
                  <td>{record.version ?? 1}</td>
                  <td>{record.updatedBy ?? 'System'}</td>
                  <td>
                    {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <Link
                      to={`/medical-records/${record.id}`}
                      className="btn-action"
                      aria-label={`View record for ${record.patient?.name ?? 'patient'}`}
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

export default Audit;

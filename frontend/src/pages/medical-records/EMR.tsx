/**
 * WF-COMP-XXX | EMR.tsx - E M R
 * Purpose: React component for EMR functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import '../../styles/Page.css';

interface EmrRecord {
  id: string;
  visitDate: string;
  chiefComplaint?: string;
  diagnosis?: string;
  patient?: { id: string; name: string };
  veterinarian?: { id: string; firstName: string; lastName: string };
}

const EMR = () => {
  const [patientId, setPatientId] = useState('');
  const { data, isLoading, isError } = useMedicalRecords({
    limit: 50,
    patientId: patientId || undefined,
  });

  const records = (data as { data?: EmrRecord[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Electronic Medical Records</h1>
        <p className="page-subtitle">Comprehensive digital health records</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="emr-patient-filter" className="sr-only">
          Filter records by patient ID
        </label>
        <input
          id="emr-patient-filter"
          type="search"
          placeholder="Filter by patient ID..."
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          aria-label="Filter records by patient ID"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading medical records...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load medical records. Please try again.</p>
          </div>
        ) : records.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No medical records found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Electronic medical records">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Patient</th>
                <th scope="col">Chief Complaint</th>
                <th scope="col">Diagnosis</th>
                <th scope="col">Veterinarian</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <time dateTime={record.visitDate}>
                      {new Date(record.visitDate).toLocaleDateString()}
                    </time>
                  </td>
                  <th scope="row">{record.patient?.name ?? 'Unknown'}</th>
                  <td>{record.chiefComplaint ?? 'N/A'}</td>
                  <td>{record.diagnosis ?? 'N/A'}</td>
                  <td>
                    {record.veterinarian
                      ? `Dr. ${record.veterinarian.firstName} ${record.veterinarian.lastName}`
                      : 'Unassigned'}
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

export default EMR;

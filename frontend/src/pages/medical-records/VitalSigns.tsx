/**
 * WF-COMP-XXX | VitalSigns.tsx - Vital Signs
 * Purpose: React component for VitalSigns functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import '../../styles/Page.css';

interface VitalSignsRecord {
  id: string;
  visitDate: string;
  patient?: { id: string; name: string };
  vitalSigns?: {
    temperature?: number | string;
    heartRate?: number | string;
    respiratoryRate?: number | string;
    weight?: number | string;
  } | null;
}

const formatVital = (value: number | string | undefined): string =>
  value === undefined || value === null || value === '' ? '—' : String(value);

const VitalSigns = () => {
  const [patientId, setPatientId] = useState('');
  const { data, isLoading, isError } = useMedicalRecords({
    limit: 50,
    patientId: patientId || undefined,
  });

  const records = (data as { data?: VitalSignsRecord[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Vital Signs</h1>
        <p className="page-subtitle">Recorded vitals captured during visits</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="vitals-patient-filter" className="sr-only">
          Filter vitals by patient ID
        </label>
        <input
          id="vitals-patient-filter"
          type="search"
          placeholder="Filter by patient ID..."
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          aria-label="Filter vitals by patient ID"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading vital signs...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load vital signs. Please try again.</p>
          </div>
        ) : records.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No vital sign records found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Vital signs">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Patient</th>
                <th scope="col">Temp</th>
                <th scope="col">Heart Rate</th>
                <th scope="col">Resp. Rate</th>
                <th scope="col">Weight</th>
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
                  <td>{formatVital(record.vitalSigns?.temperature)}</td>
                  <td>{formatVital(record.vitalSigns?.heartRate)}</td>
                  <td>{formatVital(record.vitalSigns?.respiratoryRate)}</td>
                  <td>{formatVital(record.vitalSigns?.weight)}</td>
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

export default VitalSigns;

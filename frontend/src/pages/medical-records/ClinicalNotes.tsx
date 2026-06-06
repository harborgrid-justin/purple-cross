/**
 * WF-COMP-XXX | ClinicalNotes.tsx - Clinical Notes
 * Purpose: React component for ClinicalNotes functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import '../../styles/Page.css';

interface ClinicalNoteRecord {
  id: string;
  visitDate: string;
  chiefComplaint?: string;
  notes?: string;
  patient?: { id: string; name: string };
}

const ClinicalNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useMedicalRecords({ limit: 50 });

  const records = (data as { data?: ClinicalNoteRecord[] } | undefined)?.data ?? [];

  const searchLower = searchTerm.toLowerCase();
  const filtered = searchTerm
    ? records.filter(
        (r) =>
          (r.patient?.name ?? '').toLowerCase().includes(searchLower) ||
          (r.chiefComplaint ?? '').toLowerCase().includes(searchLower) ||
          (r.notes ?? '').toLowerCase().includes(searchLower)
      )
    : records;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Clinical Notes</h1>
        <p className="page-subtitle">Documented visit observations and notes</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="clinical-notes-search" className="sr-only">
          Search clinical notes
        </label>
        <input
          id="clinical-notes-search"
          type="search"
          placeholder="Search by patient, complaint, or note text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search clinical notes"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading clinical notes...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load clinical notes. Please try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No clinical notes found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Clinical notes">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Patient</th>
                <th scope="col">Chief Complaint</th>
                <th scope="col">Notes</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <time dateTime={record.visitDate}>
                      {new Date(record.visitDate).toLocaleDateString()}
                    </time>
                  </td>
                  <th scope="row">{record.patient?.name ?? 'Unknown'}</th>
                  <td>{record.chiefComplaint ?? 'N/A'}</td>
                  <td>{record.notes ?? 'No notes recorded'}</td>
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

export default ClinicalNotes;

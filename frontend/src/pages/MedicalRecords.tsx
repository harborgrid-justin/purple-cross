/**
 * WF-COMP-XXX | MedicalRecords.tsx - Medical Records
 * Purpose: React component for MedicalRecords functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2026-05-26 | File Type: .tsx
 */

import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useMedicalRecords } from '../hooks/useMedicalRecords';
import '../styles/Page.css';

// Lazy load subfeature pages
const EMR = lazy(() => import('./medical-records/EMR'));
const ClinicalNotes = lazy(() => import('./medical-records/ClinicalNotes'));
const Diagnostics = lazy(() => import('./medical-records/Diagnostics'));
const TreatmentHistory = lazy(() => import('./medical-records/TreatmentHistory'));
const VitalSigns = lazy(() => import('./medical-records/VitalSigns'));
const Attachments = lazy(() => import('./medical-records/Attachments'));
const Sharing = lazy(() => import('./medical-records/Sharing'));
const Audit = lazy(() => import('./medical-records/Audit'));
const MedicalRecordsCreate = lazy(() => import('./medical-records/MedicalRecordsCreate'));
const MedicalRecordsEdit = lazy(() => import('./medical-records/MedicalRecordsEdit'));

interface MedicalRecord {
  id: string;
  visitDate: string;
  chiefComplaint: string;
  diagnosis?: string;
  patient?: { id: string; name: string };
  veterinarian?: { id: string; firstName: string; lastName: string };
}

const MedicalRecordsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading: loading, isError } = useMedicalRecords({ limit: 50 });

  const records = (data as { data?: MedicalRecord[] } | undefined)?.data ?? [];

  const searchLower = searchTerm.toLowerCase();
  const filteredRecords = searchTerm
    ? records.filter(
        (record) =>
          (record.patient?.name ?? '').toLowerCase().includes(searchLower) ||
          record.chiefComplaint.toLowerCase().includes(searchLower) ||
          (record.diagnosis ?? '').toLowerCase().includes(searchLower)
      )
    : records;

  return (
    <div className="table-container">
      <div className="search-bar" role="search">
        <label htmlFor="medical-record-search" className="sr-only">
          Search medical records
        </label>
        <input
          id="medical-record-search"
          type="search"
          placeholder="Search medical records by patient, complaint, or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search medical records by patient, complaint, or diagnosis"
        />
      </div>
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading medical records...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load medical records. Please try again.</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No medical records found. Add a new record to get started.</p>
        </div>
      ) : (
        <table className="data-table" role="table" aria-label="Medical records list">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Patient</th>
              <th scope="col">Chief Complaint</th>
              <th scope="col">Veterinarian</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>
                  <time dateTime={record.visitDate}>
                    {new Date(record.visitDate).toLocaleDateString()}
                  </time>
                </td>
                <th scope="row">{record.patient?.name ?? 'Unknown'}</th>
                <td>{record.chiefComplaint}</td>
                <td>
                  {record.veterinarian
                    ? `Dr. ${record.veterinarian.firstName} ${record.veterinarian.lastName}`
                    : 'Unassigned'}
                </td>
                <td>
                  <Link
                    to={`/medical-records/${record.id}/edit`}
                    className="btn-action"
                    aria-label={`Edit record for ${record.patient?.name ?? 'patient'}`}
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

const MedicalRecords = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📋</span> Medical Records
        </h1>
        <Link to="/medical-records/create" className="btn-primary" aria-label="Add new medical record">
          + Add Record
        </Link>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Medical Records sections">
        <Link
          to="/medical-records"
          className={`sub-nav-link ${location.pathname === '/medical-records' ? 'active' : ''}`}
        >
          All Records
        </Link>
        <Link
          to="/medical-records/emr"
          className={`sub-nav-link ${location.pathname.includes('/emr') ? 'active' : ''}`}
        >
          EMR
        </Link>
        <Link
          to="/medical-records/clinical-notes"
          className={`sub-nav-link ${location.pathname.includes('/clinical-notes') ? 'active' : ''}`}
        >
          Clinical Notes
        </Link>
        <Link
          to="/medical-records/diagnostics"
          className={`sub-nav-link ${location.pathname.includes('/diagnostics') ? 'active' : ''}`}
        >
          Diagnostics
        </Link>
        <Link
          to="/medical-records/treatment-history"
          className={`sub-nav-link ${location.pathname.includes('/treatment-history') ? 'active' : ''}`}
        >
          Treatment History
        </Link>
        <Link
          to="/medical-records/vital-signs"
          className={`sub-nav-link ${location.pathname.includes('/vital-signs') ? 'active' : ''}`}
        >
          Vital Signs
        </Link>
        <Link
          to="/medical-records/attachments"
          className={`sub-nav-link ${location.pathname.includes('/attachments') ? 'active' : ''}`}
        >
          Attachments
        </Link>
        <Link
          to="/medical-records/sharing"
          className={`sub-nav-link ${location.pathname.includes('/sharing') ? 'active' : ''}`}
        >
          Record Sharing
        </Link>
        <Link
          to="/medical-records/audit"
          className={`sub-nav-link ${location.pathname.includes('/audit') ? 'active' : ''}`}
        >
          Audit Trail
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
          <Route path="/" element={<MedicalRecordsList />} />
          <Route path="/create" element={<MedicalRecordsCreate />} />
          <Route path="/:id/edit" element={<MedicalRecordsEdit />} />
          <Route path="/emr" element={<EMR />} />
          <Route path="/clinical-notes" element={<ClinicalNotes />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/treatment-history" element={<TreatmentHistory />} />
          <Route path="/vital-signs" element={<VitalSigns />} />
          <Route path="/attachments" element={<Attachments />} />
          <Route path="/sharing" element={<Sharing />} />
          <Route path="/audit" element={<Audit />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default MedicalRecords;

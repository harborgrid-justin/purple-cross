/**
 * WF-COMP-XXX | MedicalRecords.tsx - Medical Records
 * Purpose: React component for MedicalRecords functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState, useEffect, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import api from '../services/api';
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

interface MedicalRecord {
  id: string;
  visitDate: string;
  chiefComplaint: string;
  diagnosis?: string;
  patient: { id: string; name: string };
  veterinarian: { id: string; firstName: string; lastName: string };
}

const MedicalRecordsList = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = (await api.medicalRecords.getAll({
          limit: 50,
        })) as { status: string; data: MedicalRecord[] };
        setRecords(response.data);
        setFilteredRecords(response.data);
      } catch (err) {
        console.error('Error fetching medical records:', err);
        setRecords([]);
        setFilteredRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
      return;
    }

    const filtered = records.filter((record) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        record.patient.name.toLowerCase().includes(searchLower) ||
        record.chiefComplaint.toLowerCase().includes(searchLower) ||
        (record.diagnosis && record.diagnosis.toLowerCase().includes(searchLower))
      );
    });
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  return (
    <div className="table-container">
      <div className="search-container" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          id="medical-record-search"
          placeholder="Search medical records by patient, complaint, or diagnosis..."
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
          <p>Loading medical records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No medical records found.</p>
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
                <th scope="row">{record.patient.name}</th>
                <td>{record.chiefComplaint}</td>
                <td>
                  Dr. {record.veterinarian.firstName} {record.veterinarian.lastName}
                </td>
                <td>
                  <button
                    className="btn-action"
                    aria-label={`View record for ${record.patient.name}`}
                  >
                    View
                  </button>
                  <button
                    className="btn-action"
                    aria-label={`Edit record for ${record.patient.name}`}
                  >
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

const MedicalRecords = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📋</span> Medical Records
        </h1>
        <button className="btn-primary" aria-label="Add new medical record">
          + Add Record
        </button>
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
        <Link to="/medical-records" className="sub-nav-link active">
          All Records
        </Link>
        <Link to="/medical-records/emr" className="sub-nav-link">
          EMR
        </Link>
        <Link to="/medical-records/clinical-notes" className="sub-nav-link">
          Clinical Notes
        </Link>
        <Link to="/medical-records/diagnostics" className="sub-nav-link">
          Diagnostics
        </Link>
        <Link to="/medical-records/treatment-history" className="sub-nav-link">
          Treatment History
        </Link>
        <Link to="/medical-records/vital-signs" className="sub-nav-link">
          Vital Signs
        </Link>
        <Link to="/medical-records/attachments" className="sub-nav-link">
          Attachments
        </Link>
        <Link to="/medical-records/sharing" className="sub-nav-link">
          Record Sharing
        </Link>
        <Link to="/medical-records/audit" className="sub-nav-link">
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

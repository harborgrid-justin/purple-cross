import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
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

const MedicalRecordsList = () => {
  const [records] = useState([
    { id: '1', patient: 'Max', date: '2024-01-15', type: 'Checkup', veterinarian: 'Dr. Smith' },
    {
      id: '2',
      patient: 'Luna',
      date: '2024-01-14',
      type: 'Vaccination',
      veterinarian: 'Dr. Jones',
    },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Medical records list">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Patient</th>
            <th scope="col">Type</th>
            <th scope="col">Veterinarian</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <th scope="row">{record.patient}</th>
              <td>{record.type}</td>
              <td>{record.veterinarian}</td>
              <td>
                <button className="btn-action" aria-label={`View record for ${record.patient}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Edit record for ${record.patient}`}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const MedicalRecords = () => {
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
    </div>
  );
};

export default MedicalRecords;

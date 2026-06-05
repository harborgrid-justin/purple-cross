/**
 * WF-COMP-XXX | History.tsx - History
 * Purpose: Full prescription history list across patients
 * Dependencies: usePrescriptions
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import '../../styles/Page.css';

interface PrescriptionRow {
  id: string;
  dosage: string;
  frequency: string;
  duration?: string;
  status?: string;
  prescriptionDate?: string;
  patient?: { name: string };
  medication?: { name: string };
}

const History = () => {
  const { data, isLoading: loading, isError } = usePrescriptions({ limit: 100 });

  const prescriptions = (data as { data?: PrescriptionRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Prescription History</h1>
        <p className="page-subtitle">Complete medication history across patients</p>
      </header>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading prescription history...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load prescriptions. Please try again.</p>
          </div>
        ) : prescriptions.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No prescriptions found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Prescription history">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Medication</th>
                <th scope="col">Dosage</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((rx) => (
                <tr key={rx.id}>
                  <th scope="row">{rx.patient?.name ?? 'Unknown'}</th>
                  <td>{rx.medication?.name ?? 'N/A'}</td>
                  <td>{rx.dosage}</td>
                  <td>
                    {rx.prescriptionDate
                      ? new Date(rx.prescriptionDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${rx.status ?? 'pending'}`}
                      role="status"
                      aria-label={`Status: ${rx.status ?? 'unknown'}`}
                    >
                      {rx.status ?? 'N/A'}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/prescriptions/${rx.id}`}
                      className="btn-action"
                      aria-label={`View prescription for ${rx.patient?.name ?? 'patient'}`}
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

export default History;

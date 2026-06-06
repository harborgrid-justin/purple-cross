/**
 * WF-COMP-XXX | ControlledSubstances.tsx - Controlled Substances
 * Purpose: List prescriptions for controlled (scheduled) medications
 * Dependencies: usePrescriptions
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import '../../styles/Page.css';

interface ControlledRx {
  id: string;
  dosage: string;
  status?: string;
  prescriptionDate?: string;
  patient?: { name: string };
  medication?: { name: string; isControlled?: boolean; schedule?: string };
}

const ControlledSubstances = () => {
  const { data, isLoading: loading, isError } = usePrescriptions({ limit: 100 });

  const all = (data as { data?: ControlledRx[] } | undefined)?.data ?? [];
  const controlled = all.filter(
    (rx) => rx.medication?.isControlled === true || !!rx.medication?.schedule
  );

  return (
    <div className="page">
      <header className="page-header">
        <h1>Controlled Substance Tracking</h1>
        <p className="page-subtitle">DEA-scheduled medication prescriptions</p>
      </header>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading controlled substances...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load prescriptions. Please try again.</p>
          </div>
        ) : controlled.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No controlled substance prescriptions found.</p>
          </div>
        ) : (
          <table
            className="data-table"
            role="table"
            aria-label="Controlled substance prescriptions"
          >
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Medication</th>
                <th scope="col">Schedule</th>
                <th scope="col">Dosage</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {controlled.map((rx) => (
                <tr key={rx.id}>
                  <th scope="row">{rx.patient?.name ?? 'Unknown'}</th>
                  <td>{rx.medication?.name ?? 'N/A'}</td>
                  <td>{rx.medication?.schedule ?? 'Controlled'}</td>
                  <td>{rx.dosage}</td>
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

export default ControlledSubstances;

/**
 * WF-COMP-XXX | Compounding.tsx - Compounding
 * Purpose: List prescriptions that require custom compounding
 * Dependencies: usePrescriptions
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import '../../styles/Page.css';

interface CompoundRx {
  id: string;
  dosage: string;
  frequency: string;
  status?: string;
  instructions?: string;
  isCompounded?: boolean;
  patient?: { name: string };
  medication?: { name: string; isCompounded?: boolean };
}

const Compounding = () => {
  const { data, isLoading: loading, isError } = usePrescriptions({ limit: 100 });

  const all = (data as { data?: CompoundRx[] } | undefined)?.data ?? [];
  const compounded = all.filter(
    (rx) => rx.isCompounded === true || rx.medication?.isCompounded === true
  );

  return (
    <div className="page">
      <header className="page-header">
        <h1>Compounding Management</h1>
        <p className="page-subtitle">Prescriptions requiring custom formulation</p>
      </header>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading compounded prescriptions...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load prescriptions. Please try again.</p>
          </div>
        ) : compounded.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No compounded prescriptions found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Compounded prescriptions">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Medication</th>
                <th scope="col">Dosage</th>
                <th scope="col">Instructions</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {compounded.map((rx) => (
                <tr key={rx.id}>
                  <th scope="row">{rx.patient?.name ?? 'Unknown'}</th>
                  <td>{rx.medication?.name ?? 'N/A'}</td>
                  <td>{rx.dosage}</td>
                  <td>{rx.instructions ?? '—'}</td>
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

export default Compounding;

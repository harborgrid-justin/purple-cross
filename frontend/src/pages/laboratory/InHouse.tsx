/**
 * WF-COMP-XXX | InHouse.tsx - In House
 * Purpose: React hook for managing InHox data and operations
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useLabTests } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface LabTestRow {
  id: string;
  testName?: string;
  testType?: string;
  labType?: string;
  status?: string;
  orderedDate?: string;
  patient?: { id: string; name: string };
}

const InHouse = () => {
  const { data, isLoading, isError } = useLabTests({ limit: 50 });

  const tests = (data as { data?: LabTestRow[] } | undefined)?.data ?? [];
  const inHouse = tests.filter((t) => (t.labType ?? '').toLowerCase() === 'in-house');

  return (
    <div className="page">
      <header className="page-header">
        <h1>In-House Testing</h1>
        <p className="page-subtitle">Tests processed within the practice</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading in-house tests...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load in-house tests. Please try again.</p>
          </div>
        ) : inHouse.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No in-house tests found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="In-house lab tests">
            <thead>
              <tr>
                <th scope="col">Test</th>
                <th scope="col">Type</th>
                <th scope="col">Patient</th>
                <th scope="col">Ordered</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inHouse.map((test) => (
                <tr key={test.id}>
                  <th scope="row">{test.testName ?? 'N/A'}</th>
                  <td>{test.testType ?? 'N/A'}</td>
                  <td>{test.patient?.name ?? 'Unknown'}</td>
                  <td>
                    {test.orderedDate ? (
                      <time dateTime={test.orderedDate}>
                        {new Date(test.orderedDate).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${test.status ?? 'pending'}`}>
                      {test.status ?? 'pending'}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/laboratory/${test.id}`}
                      className="btn-action"
                      aria-label={`View test ${test.testName ?? ''}`}
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

export default InHouse;

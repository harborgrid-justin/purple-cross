/**
 * WF-COMP-XXX | External.tsx - External
 * Purpose: React component for External functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useLabTests } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface ExternalTestRow {
  id: string;
  testName?: string;
  testType?: string;
  labType?: string;
  externalLabName?: string;
  status?: string;
  orderedDate?: string;
  patient?: { id: string; name: string };
}

const External = () => {
  const { data, isLoading, isError } = useLabTests({ limit: 50 });

  const tests = (data as { data?: ExternalTestRow[] } | undefined)?.data ?? [];
  const external = tests.filter((t) => (t.labType ?? '').toLowerCase() === 'external');

  return (
    <div className="page">
      <header className="page-header">
        <h1>External Lab Integration</h1>
        <p className="page-subtitle">Tests sent to external reference laboratories</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading external tests...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load external tests. Please try again.</p>
          </div>
        ) : external.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No external tests found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="External lab tests">
            <thead>
              <tr>
                <th scope="col">Test</th>
                <th scope="col">External Lab</th>
                <th scope="col">Patient</th>
                <th scope="col">Ordered</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {external.map((test) => (
                <tr key={test.id}>
                  <th scope="row">{test.testName ?? 'N/A'}</th>
                  <td>{test.externalLabName ?? 'N/A'}</td>
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

export default External;

/**
 * WF-COMP-XXX | Results.tsx - Results
 * Purpose: React component for Results functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useLabTests } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface ResultRow {
  id: string;
  testName?: string;
  testType?: string;
  interpretation?: string;
  completedDate?: string;
  patient?: { id: string; name: string };
}

const Results = () => {
  const { data, isLoading, isError } = useLabTests({ limit: 50, status: 'completed' });

  const tests = (data as { data?: ResultRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Result Interpretation</h1>
        <p className="page-subtitle">Completed tests and their interpretations</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading results...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load results. Please try again.</p>
          </div>
        ) : tests.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No completed results found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Lab results">
            <thead>
              <tr>
                <th scope="col">Test</th>
                <th scope="col">Patient</th>
                <th scope="col">Interpretation</th>
                <th scope="col">Completed</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <th scope="row">{test.testName ?? 'N/A'}</th>
                  <td>{test.patient?.name ?? 'Unknown'}</td>
                  <td>{test.interpretation ?? 'Pending interpretation'}</td>
                  <td>
                    {test.completedDate ? (
                      <time dateTime={test.completedDate}>
                        {new Date(test.completedDate).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
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

export default Results;

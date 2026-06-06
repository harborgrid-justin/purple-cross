/**
 * WF-COMP-XXX | QualityAssurance.tsx - Quality Assurance
 * Purpose: React component for QualityAssurance functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useLabTests } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface QaTestRow {
  id: string;
  testName?: string;
  status?: string;
  urgency?: string;
  orderedDate?: string;
  completedDate?: string;
  patient?: { id: string; name: string };
}

const QualityAssurance = () => {
  const { data, isLoading, isError } = useLabTests({ limit: 50 });

  const tests = (data as { data?: QaTestRow[] } | undefined)?.data ?? [];

  // QA view surfaces tests that are flagged urgent or still outstanding so
  // they can be audited for turnaround quality.
  const flagged = tests.filter(
    (t) =>
      (t.urgency ?? '').toLowerCase() === 'urgent' ||
      ((t.status ?? '').toLowerCase() !== 'completed' &&
        (t.status ?? '').toLowerCase() !== 'cancelled')
  );

  return (
    <div className="page">
      <header className="page-header">
        <h1>Quality Assurance</h1>
        <p className="page-subtitle">Urgent and outstanding tests requiring QA review</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading quality assurance queue...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load quality assurance queue. Please try again.</p>
          </div>
        ) : flagged.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No tests currently require QA review.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Quality assurance queue">
            <thead>
              <tr>
                <th scope="col">Test</th>
                <th scope="col">Patient</th>
                <th scope="col">Urgency</th>
                <th scope="col">Status</th>
                <th scope="col">Ordered</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flagged.map((test) => (
                <tr key={test.id}>
                  <th scope="row">{test.testName ?? 'N/A'}</th>
                  <td>{test.patient?.name ?? 'Unknown'}</td>
                  <td>
                    <span className={`status-badge status-${test.urgency ?? 'routine'}`}>
                      {test.urgency ?? 'routine'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${test.status ?? 'pending'}`}>
                      {test.status ?? 'pending'}
                    </span>
                  </td>
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

export default QualityAssurance;

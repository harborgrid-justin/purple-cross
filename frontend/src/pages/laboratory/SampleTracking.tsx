/**
 * WF-COMP-XXX | SampleTracking.tsx - Sample Tracking
 * Purpose: React component for SampleTracking functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useLabTests } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface SampleRow {
  id: string;
  testName?: string;
  sampleId?: string;
  status?: string;
  collectionDate?: string;
  receivedDate?: string;
  completedDate?: string;
  patient?: { id: string; name: string };
}

const fmtDate = (value?: string): string => (value ? new Date(value).toLocaleDateString() : '—');

const SampleTracking = () => {
  const { data, isLoading, isError } = useLabTests({ limit: 50 });

  const tests = (data as { data?: SampleRow[] } | undefined)?.data ?? [];
  // Only tests with a sample associated are meaningful to track.
  const samples = tests.filter((t) => !!t.sampleId);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Sample Tracking</h1>
        <p className="page-subtitle">Sample lifecycle from collection to completion</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading samples...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load samples. Please try again.</p>
          </div>
        ) : samples.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No tracked samples found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Sample tracking">
            <thead>
              <tr>
                <th scope="col">Sample ID</th>
                <th scope="col">Test</th>
                <th scope="col">Patient</th>
                <th scope="col">Collected</th>
                <th scope="col">Received</th>
                <th scope="col">Completed</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((test) => (
                <tr key={test.id}>
                  <th scope="row">{test.sampleId}</th>
                  <td>{test.testName ?? 'N/A'}</td>
                  <td>{test.patient?.name ?? 'Unknown'}</td>
                  <td>{fmtDate(test.collectionDate)}</td>
                  <td>{fmtDate(test.receivedDate)}</td>
                  <td>{fmtDate(test.completedDate)}</td>
                  <td>
                    <span className={`status-badge status-${test.status ?? 'pending'}`}>
                      {test.status ?? 'pending'}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/laboratory/${test.id}`}
                      className="btn-action"
                      aria-label={`View sample for ${test.testName ?? ''}`}
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

export default SampleTracking;

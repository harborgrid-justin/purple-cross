/**
 * WF-COMP-XXX | LabReports.tsx - Lab Reports
 * Purpose: React component for LabReports functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useLabTests } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface ReportRow {
  id: string;
  testName?: string;
  testType?: string;
  labType?: string;
  results?: unknown;
  completedDate?: string;
  patient?: { id: string; name: string };
}

const LabReports = () => {
  const { data, isLoading, isError } = useLabTests({ limit: 50, status: 'completed' });

  const tests = (data as { data?: ReportRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Lab Reports</h1>
        <p className="page-subtitle">Finalized laboratory reports</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading lab reports...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load lab reports. Please try again.</p>
          </div>
        ) : tests.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No lab reports available.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Lab reports">
            <thead>
              <tr>
                <th scope="col">Test</th>
                <th scope="col">Type</th>
                <th scope="col">Patient</th>
                <th scope="col">Source</th>
                <th scope="col">Results</th>
                <th scope="col">Completed</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <th scope="row">{test.testName ?? 'N/A'}</th>
                  <td>{test.testType ?? 'N/A'}</td>
                  <td>{test.patient?.name ?? 'Unknown'}</td>
                  <td>{test.labType ?? 'N/A'}</td>
                  <td>{test.results ? 'Available' : 'No data'}</td>
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
                      aria-label={`View report for ${test.testName ?? ''}`}
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

export default LabReports;

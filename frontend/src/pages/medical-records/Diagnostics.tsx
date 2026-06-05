/**
 * WF-COMP-XXX | Diagnostics.tsx - Diagnostics
 * Purpose: React component for Diagnostics functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLabTests } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface DiagnosticTest {
  id: string;
  testName?: string;
  testType?: string;
  status?: string;
  orderedDate?: string;
  patient?: { id: string; name: string };
}

const Diagnostics = () => {
  const [patientId, setPatientId] = useState('');
  const { data, isLoading, isError } = useLabTests({
    limit: 50,
    patientId: patientId || undefined,
  });

  const tests = (data as { data?: DiagnosticTest[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Diagnostics</h1>
        <p className="page-subtitle">Lab and diagnostic tests linked to patient care</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="diagnostics-patient-filter" className="sr-only">
          Filter diagnostics by patient ID
        </label>
        <input
          id="diagnostics-patient-filter"
          type="search"
          placeholder="Filter by patient ID..."
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          aria-label="Filter diagnostics by patient ID"
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading diagnostics...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load diagnostics. Please try again.</p>
          </div>
        ) : tests.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No diagnostic tests found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Diagnostic tests">
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
              {tests.map((test) => (
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

export default Diagnostics;

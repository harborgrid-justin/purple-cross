/**
 * WF-COMP-XXX | APIAnalytics.tsx - A P I Analytics
 * Purpose: API service for APIAnalytics.tsx endpoints and operations
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useDashboardAnalytics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface DashboardMetrics {
  totalPatients?: number;
  totalClients?: number;
  appointmentsToday?: number;
  revenueThisMonth?: number;
}

const APIAnalytics = () => {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardAnalytics();

  const metrics = (data as { data?: DashboardMetrics } | undefined)?.data ?? {};

  // Derive lightweight "API request" style figures from the live platform data
  // so the analytics view reflects real entity volumes served by the backend.
  const entityRows: Array<{ resource: string; records: number }> = [
    { resource: 'GET /patients', records: metrics.totalPatients ?? 0 },
    { resource: 'GET /clients', records: metrics.totalClients ?? 0 },
    { resource: 'GET /appointments (today)', records: metrics.appointmentsToday ?? 0 },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <h1>API Analytics</h1>
        <button
          className="btn-secondary"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh API analytics"
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>
      <p className="page-subtitle">Live data volumes served through the platform API.</p>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading API analytics…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load API analytics. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                🐾
              </span>
              <div className="stat-content">
                <div className="stat-label">Patient Records</div>
                <div className="stat-value">{(metrics.totalPatients ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                👥
              </span>
              <div className="stat-content">
                <div className="stat-label">Client Records</div>
                <div className="stat-value">{(metrics.totalClients ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                📅
              </span>
              <div className="stat-content">
                <div className="stat-label">Appointments Today</div>
                <div className="stat-value">
                  {(metrics.appointmentsToday ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <h2>Resource Volumes</h2>
          <div className="table-container">
            <table className="data-table" role="table" aria-label="API resource volumes">
              <thead>
                <tr>
                  <th scope="col">Endpoint</th>
                  <th scope="col">Records</th>
                </tr>
              </thead>
              <tbody>
                {entityRows.map((row) => (
                  <tr key={row.resource}>
                    <th scope="row">{row.resource}</th>
                    <td>{row.records.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default APIAnalytics;

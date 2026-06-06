/**
 * WF-COMP-XXX | Clinical.tsx - Clinical
 * Purpose: React component for Clinical functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useDashboardAnalytics, usePatientDemographics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface DashboardMetrics {
  totalPatients?: number;
  appointmentsToday?: number;
  upcomingAppointments?: number;
}

interface SpeciesBreakdown {
  bySpecies?: Array<{ species: string; count: number }>;
}

const Clinical = () => {
  const dashboardQuery = useDashboardAnalytics();
  const demographicsQuery = usePatientDemographics();

  const metrics = (dashboardQuery.data as { data?: DashboardMetrics } | undefined)?.data ?? {};
  const demographics =
    (demographicsQuery.data as { data?: SpeciesBreakdown } | undefined)?.data ?? {};
  const bySpecies = demographics.bySpecies ?? [];

  const isLoading = dashboardQuery.isLoading || demographicsQuery.isLoading;
  const isError = dashboardQuery.isError || demographicsQuery.isError;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Clinical Analytics</h1>
      </header>
      <p className="page-subtitle">Caseload and patient population overview.</p>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading clinical analytics…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load clinical analytics. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                🐾
              </span>
              <div className="stat-content">
                <div className="stat-label">Total Patients</div>
                <div className="stat-value">{(metrics.totalPatients ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                📅
              </span>
              <div className="stat-content">
                <div className="stat-label">Cases Today</div>
                <div className="stat-value">
                  {(metrics.appointmentsToday ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                ⏭️
              </span>
              <div className="stat-content">
                <div className="stat-label">Upcoming Cases</div>
                <div className="stat-value">
                  {(metrics.upcomingAppointments ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <h2>Patient Population by Species</h2>
          <div className="table-container">
            {bySpecies.length === 0 ? (
              <div role="status" aria-live="polite">
                <p>No species breakdown available.</p>
              </div>
            ) : (
              <table className="data-table" role="table" aria-label="Patients by species">
                <thead>
                  <tr>
                    <th scope="col">Species</th>
                    <th scope="col">Patients</th>
                  </tr>
                </thead>
                <tbody>
                  {bySpecies.map((row) => (
                    <tr key={row.species}>
                      <th scope="row">{row.species}</th>
                      <td>{row.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Clinical;

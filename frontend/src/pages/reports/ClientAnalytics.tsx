/**
 * WF-COMP-XXX | ClientAnalytics.tsx - Client Analytics
 * Purpose: React component for ClientAnalytics functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { usePatientDemographics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface Demographics {
  totalClients?: number;
  activeClients?: number;
  newClientsThisMonth?: number;
  bySpecies?: Array<{ species: string; count: number }>;
  byBreed?: Array<{ breed: string; count: number }>;
}

const ClientAnalytics = () => {
  const { data, isLoading, isError } = usePatientDemographics();

  const demographics = (data as { data?: Demographics } | undefined)?.data ?? {};
  const bySpecies = demographics.bySpecies ?? [];
  const byBreed = demographics.byBreed ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Analytics</h1>
      </header>
      <p className="page-subtitle">Client base composition and patient demographics.</p>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading client analytics…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load client analytics. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                👥
              </span>
              <div className="stat-content">
                <div className="stat-label">Total Clients</div>
                <div className="stat-value">{(demographics.totalClients ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                🟢
              </span>
              <div className="stat-content">
                <div className="stat-label">Active Clients</div>
                <div className="stat-value">
                  {(demographics.activeClients ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                ✨
              </span>
              <div className="stat-content">
                <div className="stat-label">New This Month</div>
                <div className="stat-value">
                  {(demographics.newClientsThisMonth ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <h2>Patients by Species</h2>
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
                    <th scope="col">Count</th>
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

          <h2>Top Breeds</h2>
          <div className="table-container">
            {byBreed.length === 0 ? (
              <div role="status" aria-live="polite">
                <p>No breed breakdown available.</p>
              </div>
            ) : (
              <table className="data-table" role="table" aria-label="Patients by breed">
                <thead>
                  <tr>
                    <th scope="col">Breed</th>
                    <th scope="col">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {byBreed.map((row) => (
                    <tr key={row.breed}>
                      <th scope="row">{row.breed}</th>
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

export default ClientAnalytics;

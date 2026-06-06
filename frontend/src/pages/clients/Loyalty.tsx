/**
 * WF-COMP-XXX | Loyalty.tsx - Loyalty
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Loyalty functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useLoyaltyPrograms } from '../../hooks/useLoyaltyPrograms';
import '../../styles/Page.css';

interface LoyaltyRow {
  id: string;
  tier?: string;
  points?: number;
  status?: string;
  client?: { firstName: string; lastName: string };
}

const Loyalty = () => {
  const { data, isLoading, isError } = useLoyaltyPrograms({ limit: 100 });
  const programs = (data as { data?: LoyaltyRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Loyalty Programs</h1>
        <p className="page-subtitle">Track points, tiers, and rewards across enrolled clients</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading loyalty programs...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load loyalty programs. Please try again.</p>
          </div>
        ) : programs.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No clients enrolled in loyalty programs yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Loyalty programs">
            <thead>
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Tier</th>
                <th scope="col">Points</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => {
                const status = program.status ?? 'active';
                return (
                  <tr key={program.id}>
                    <th scope="row">
                      {program.client
                        ? `${program.client.firstName} ${program.client.lastName}`
                        : 'Unknown'}
                    </th>
                    <td>{program.tier || 'Bronze'}</td>
                    <td>{program.points ?? 0}</td>
                    <td>
                      <span
                        className={`status-badge status-${status}`}
                        role="status"
                        aria-label={`Status: ${status}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Loyalty;

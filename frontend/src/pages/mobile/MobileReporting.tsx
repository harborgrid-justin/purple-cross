/**
 * WF-COMP-XXX | MobileReporting.tsx - Mobile Reporting
 * Purpose: React component for MobileReporting functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useDashboardAnalytics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface DashboardMetrics {
  totalPatients?: number;
  appointmentsToday?: number;
  upcomingAppointments?: number;
  revenueThisMonth?: number;
}

const formatCurrency = (value: number | undefined): string =>
  typeof value === 'number'
    ? value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    : '$0.00';

const MobileReporting = () => {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardAnalytics();

  const metrics = (data as { data?: DashboardMetrics } | undefined)?.data ?? {};

  return (
    <div className="page">
      <header className="page-header">
        <h1>Mobile Reporting</h1>
        <button
          className="btn-secondary"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh mobile report"
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>
      <p className="page-subtitle">Key practice metrics optimized for on-the-go viewing.</p>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading metrics…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load metrics. Please try again.</p>
        </div>
      ) : (
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
              <div className="stat-label">Appointments Today</div>
              <div className="stat-value">{(metrics.appointmentsToday ?? 0).toLocaleString()}</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              ⏭️
            </span>
            <div className="stat-content">
              <div className="stat-label">Upcoming</div>
              <div className="stat-value">
                {(metrics.upcomingAppointments ?? 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              💰
            </span>
            <div className="stat-content">
              <div className="stat-label">Revenue This Month</div>
              <div className="stat-value">{formatCurrency(metrics.revenueThisMonth)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileReporting;

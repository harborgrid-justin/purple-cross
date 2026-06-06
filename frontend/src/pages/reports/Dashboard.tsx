/**
 * WF-COMP-XXX | Dashboard.tsx - Dashboard
 * Purpose: React component for Dashboard functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useDashboardAnalytics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface DashboardMetrics {
  totalPatients?: number;
  totalClients?: number;
  appointmentsToday?: number;
  upcomingAppointments?: number;
  revenueThisMonth?: number;
  outstandingInvoices?: number;
  lowStockItems?: number;
  activeStaff?: number;
}

const formatNumber = (value: number | undefined): string =>
  typeof value === 'number' ? value.toLocaleString() : '0';

const formatCurrency = (value: number | undefined): string =>
  typeof value === 'number'
    ? value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    : '$0.00';

const Dashboard = () => {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardAnalytics();

  const metrics = (data as { data?: DashboardMetrics } | undefined)?.data ?? {};

  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard &amp; KPIs</h1>
        <button
          className="btn-secondary"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh dashboard metrics"
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>
      <p className="page-subtitle">Live operational and financial metrics for your practice.</p>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading dashboard metrics…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load dashboard metrics. Please try again.</p>
        </div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              🐾
            </span>
            <div className="stat-content">
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{formatNumber(metrics.totalPatients)}</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              👥
            </span>
            <div className="stat-content">
              <div className="stat-label">Total Clients</div>
              <div className="stat-value">{formatNumber(metrics.totalClients)}</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              📅
            </span>
            <div className="stat-content">
              <div className="stat-label">Appointments Today</div>
              <div className="stat-value">{formatNumber(metrics.appointmentsToday)}</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              ⏭️
            </span>
            <div className="stat-content">
              <div className="stat-label">Upcoming Appointments</div>
              <div className="stat-value">{formatNumber(metrics.upcomingAppointments)}</div>
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
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              🧾
            </span>
            <div className="stat-content">
              <div className="stat-label">Outstanding Invoices</div>
              <div className="stat-value">{formatNumber(metrics.outstandingInvoices)}</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              📦
            </span>
            <div className="stat-content">
              <div className="stat-label">Low Stock Items</div>
              <div className="stat-value">{formatNumber(metrics.lowStockItems)}</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">
              🩺
            </span>
            <div className="stat-content">
              <div className="stat-label">Active Staff</div>
              <div className="stat-value">{formatNumber(metrics.activeStaff)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

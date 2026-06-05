/**
 * WF-COMP-XXX | FinancialReports.tsx - Financial Reports
 * Purpose: View financial reporting over a selectable date range
 * Dependencies: useFinancialReport
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useFinancialReport } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface FinancialReport {
  totalRevenue?: number;
  totalOutstanding?: number;
  totalRefunds?: number;
  invoiceCount?: number;
  paidInvoices?: number;
}

const FinancialReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const params = {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };
  const { data, isLoading: loading, isError } = useFinancialReport(params);

  const report = (data as { data?: FinancialReport } | undefined)?.data;

  const money = (value?: number): string =>
    value != null ? `$${Number(value).toFixed(2)}` : '—';

  return (
    <div className="page">
      <header className="page-header">
        <h1>Financial Reporting</h1>
        <p className="page-subtitle">Revenue, receivables, and refund metrics</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="report-start">From</label>
        <input
          id="report-start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label="Report start date"
        />
        <label htmlFor="report-end">To</label>
        <input
          id="report-end"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label="Report end date"
        />
      </div>

      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading financial report...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load financial report. Please try again.</p>
        </div>
      ) : !report ? (
        <div role="status" aria-live="polite">
          <p>No financial data available for the selected period.</p>
        </div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">{money(report.totalRevenue)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-label">Outstanding</div>
              <div className="stat-value">{money(report.totalOutstanding)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-label">Refunds</div>
              <div className="stat-value">{money(report.totalRefunds)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-label">Invoices</div>
              <div className="stat-value">{report.invoiceCount ?? '—'}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-label">Paid Invoices</div>
              <div className="stat-value">{report.paidInvoices ?? '—'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;

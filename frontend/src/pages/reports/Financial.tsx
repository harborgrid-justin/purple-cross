/**
 * WF-COMP-XXX | Financial.tsx - Financial
 * Purpose: React component for Financial functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { useFinancialReport } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface FinancialReport {
  totalRevenue?: number;
  totalPaid?: number;
  totalOutstanding?: number;
  invoiceCount?: number;
  averageInvoice?: number;
  byStatus?: Array<{ status: string; count: number; amount: number }>;
}

const formatCurrency = (value: number | undefined): string =>
  typeof value === 'number'
    ? value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    : '$0.00';

const Financial = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { data, isLoading, isError } = useFinancialReport({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const report = (data as { data?: FinancialReport } | undefined)?.data ?? {};
  const byStatus = report.byStatus ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Financial Reports</h1>
      </header>
      <p className="page-subtitle">Revenue, payments, and outstanding balances by period.</p>

      <div className="search-bar" role="search">
        <div className="form-group">
          <label htmlFor="financial-start">Start Date</label>
          <input
            id="financial-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="financial-end">End Date</label>
          <input
            id="financial-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading financial report…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load financial report. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                💵
              </span>
              <div className="stat-content">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">{formatCurrency(report.totalRevenue)}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                ✅
              </span>
              <div className="stat-content">
                <div className="stat-label">Total Paid</div>
                <div className="stat-value">{formatCurrency(report.totalPaid)}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                ⏳
              </span>
              <div className="stat-content">
                <div className="stat-label">Outstanding</div>
                <div className="stat-value">{formatCurrency(report.totalOutstanding)}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">
                🧾
              </span>
              <div className="stat-content">
                <div className="stat-label">Average Invoice</div>
                <div className="stat-value">{formatCurrency(report.averageInvoice)}</div>
              </div>
            </div>
          </div>

          <div className="table-container">
            {byStatus.length === 0 ? (
              <div role="status" aria-live="polite">
                <p>No invoice breakdown available for the selected period.</p>
              </div>
            ) : (
              <table className="data-table" role="table" aria-label="Revenue by invoice status">
                <thead>
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Invoices</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {byStatus.map((row) => (
                    <tr key={row.status}>
                      <th scope="row">{row.status}</th>
                      <td>{row.count}</td>
                      <td>{formatCurrency(row.amount)}</td>
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

export default Financial;

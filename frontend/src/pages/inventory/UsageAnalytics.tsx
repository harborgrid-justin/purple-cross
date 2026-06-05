/**
 * WF-COMP-XXX | UsageAnalytics.tsx - Usage Analytics
 * Purpose: Display inventory usage metrics from the analytics report
 * Dependencies: useInventoryReport
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useInventoryReport } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface TopItem {
  id?: string;
  name?: string;
  quantityUsed?: number;
}

interface InventoryReport {
  totalItems?: number;
  lowStockCount?: number;
  outOfStockCount?: number;
  totalValue?: number;
  topUsedItems?: TopItem[];
}

const UsageAnalytics = () => {
  const { data, isLoading: loading, isError } = useInventoryReport();

  const report = (data as { data?: InventoryReport } | undefined)?.data;
  const topItems = report?.topUsedItems ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Usage Analytics</h1>
        <p className="page-subtitle">Inventory consumption and stock health</p>
      </header>

      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading usage analytics...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load analytics. Please try again.</p>
        </div>
      ) : !report ? (
        <div role="status" aria-live="polite">
          <p>No analytics data available.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Total Items</div>
                <div className="stat-value">{report.totalItems ?? '—'}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Low Stock</div>
                <div className="stat-value">{report.lowStockCount ?? '—'}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Out of Stock</div>
                <div className="stat-value">{report.outOfStockCount ?? '—'}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Total Value</div>
                <div className="stat-value">
                  {report.totalValue != null ? `$${Number(report.totalValue).toFixed(2)}` : '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="table-container">
            {topItems.length === 0 ? (
              <div role="status" aria-live="polite">
                <p>No usage data for top items.</p>
              </div>
            ) : (
              <table className="data-table" role="table" aria-label="Top used items">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Quantity Used</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => (
                    <tr key={item.id ?? `${item.name ?? 'item'}-${index}`}>
                      <th scope="row">{item.name ?? 'N/A'}</th>
                      <td>{item.quantityUsed ?? 0}</td>
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

export default UsageAnalytics;

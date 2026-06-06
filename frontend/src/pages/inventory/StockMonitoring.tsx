/**
 * WF-COMP-XXX | StockMonitoring.tsx - Stock Monitoring
 * Purpose: Real-time stock levels with a low-stock filter
 * Dependencies: useInventory
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../hooks/useInventory';
import '../../styles/Page.css';

interface StockItem {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  reorderPoint: number;
  unit?: string;
}

const StockMonitoring = () => {
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const {
    data,
    isLoading: loading,
    isError,
  } = useInventory({ limit: 100, lowStock: lowStockOnly || undefined });

  const items = (data as { data?: StockItem[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Stock Level Monitoring</h1>
        <p className="page-subtitle">Track current stock and low-stock alerts</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="low-stock-toggle">
          <input
            id="low-stock-toggle"
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />{' '}
          Show low-stock items only
        </label>
      </div>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading stock levels...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load inventory. Please try again.</p>
          </div>
        ) : items.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No items found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Stock levels">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">SKU</th>
                <th scope="col">On Hand</th>
                <th scope="col">Reorder Point</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const lowStock = item.quantity <= item.reorderPoint;
                return (
                  <tr key={item.id}>
                    <th scope="row">{item.name}</th>
                    <td>{item.sku ?? 'N/A'}</td>
                    <td>
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ''}
                    </td>
                    <td>{item.reorderPoint}</td>
                    <td>
                      <span
                        className={`status-badge status-${lowStock ? 'warning' : 'confirmed'}`}
                        role="status"
                        aria-label={lowStock ? 'Low stock' : 'In stock'}
                      >
                        {lowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/inventory/${item.id}`}
                        className="btn-action"
                        aria-label={`View ${item.name}`}
                      >
                        View
                      </Link>
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

export default StockMonitoring;

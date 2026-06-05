/**
 * WF-COMP-XXX | AutoReorder.tsx - Auto Reorder
 * Purpose: Surface items at or below their reorder point for replenishment
 * Dependencies: useLowStockInventory
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Link } from 'react-router-dom';
import { useLowStockInventory } from '../../hooks/useInventory';
import '../../styles/Page.css';

interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  reorderPoint: number;
  unit?: string;
  supplier?: string;
}

const AutoReorder = () => {
  const { data, isLoading: loading, isError } = useLowStockInventory();

  const items = (data as { data?: LowStockItem[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Automatic Reordering</h1>
        <p className="page-subtitle">Items at or below their reorder point</p>
      </header>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading reorder suggestions...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load low-stock items. Please try again.</p>
          </div>
        ) : items.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No items need reordering. Stock levels are healthy.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Items to reorder">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">On Hand</th>
                <th scope="col">Reorder Point</th>
                <th scope="col">Suggested Order</th>
                <th scope="col">Supplier</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const suggested = Math.max(item.reorderPoint * 2 - item.quantity, 0);
                return (
                  <tr key={item.id}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ''}
                    </td>
                    <td>{item.reorderPoint}</td>
                    <td>{suggested}</td>
                    <td>{item.supplier ?? 'N/A'}</td>
                    <td>
                      <Link
                        to="/inventory/purchase-orders"
                        className="btn-action"
                        aria-label={`Create purchase order for ${item.name}`}
                      >
                        Order
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

export default AutoReorder;

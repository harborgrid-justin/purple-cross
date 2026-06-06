/**
 * WF-COMP-XXX | Valuation.tsx - Valuation
 * Purpose: Compute inventory value totals and per-category breakdown
 * Dependencies: useInventory
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useInventory } from '../../hooks/useInventory';
import '../../styles/Page.css';

interface ValuationItem {
  id: string;
  category?: string;
  quantity: number;
  unitCost?: number;
}

interface CategoryValue {
  category: string;
  itemCount: number;
  value: number;
}

const Valuation = () => {
  const { data, isLoading: loading, isError } = useInventory({ limit: 200 });

  const items = (data as { data?: ValuationItem[] } | undefined)?.data ?? [];

  const totalValue = items.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0) * Number(item.unitCost ?? 0),
    0
  );

  const categoryMap = new Map<string, CategoryValue>();
  for (const item of items) {
    const category = item.category?.trim() || 'Uncategorized';
    const existing = categoryMap.get(category) ?? { category, itemCount: 0, value: 0 };
    existing.itemCount += 1;
    existing.value += Number(item.quantity ?? 0) * Number(item.unitCost ?? 0);
    categoryMap.set(category, existing);
  }
  const categories = Array.from(categoryMap.values()).sort((a, b) => b.value - a.value);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Inventory Valuation</h1>
        <p className="page-subtitle">Total stock value and per-category breakdown</p>
      </header>

      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading valuation...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load inventory. Please try again.</p>
        </div>
      ) : items.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No inventory to value.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Total Inventory Value</div>
                <div className="stat-value">${totalValue.toFixed(2)}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Distinct Items</div>
                <div className="stat-value">{items.length}</div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table" role="table" aria-label="Valuation by category">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Items</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.category}>
                    <th scope="row">{cat.category}</th>
                    <td>{cat.itemCount}</td>
                    <td>${cat.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Valuation;

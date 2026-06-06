/**
 * WF-COMP-XXX | Vendors.tsx - Vendors
 * Purpose: Summarize suppliers derived from the inventory catalog
 * Dependencies: useInventory
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useInventory } from '../../hooks/useInventory';
import '../../styles/Page.css';

interface SupplierItem {
  id: string;
  supplier?: string;
  unitCost?: number;
}

interface VendorSummary {
  name: string;
  itemCount: number;
  totalValue: number;
}

const Vendors = () => {
  const { data, isLoading: loading, isError } = useInventory({ limit: 200 });

  const items = (data as { data?: SupplierItem[] } | undefined)?.data ?? [];

  const vendorMap = new Map<string, VendorSummary>();
  for (const item of items) {
    const name = item.supplier?.trim();
    if (!name) continue;
    const existing = vendorMap.get(name) ?? { name, itemCount: 0, totalValue: 0 };
    existing.itemCount += 1;
    existing.totalValue += Number(item.unitCost ?? 0);
    vendorMap.set(name, existing);
  }
  const vendors = Array.from(vendorMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page">
      <header className="page-header">
        <h1>Vendor Management</h1>
        <p className="page-subtitle">Suppliers sourced from the inventory catalog</p>
      </header>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading vendors...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load vendors. Please try again.</p>
          </div>
        ) : vendors.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No vendors found. Add suppliers to inventory items to populate this list.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Vendors">
            <thead>
              <tr>
                <th scope="col">Vendor</th>
                <th scope="col">Items Supplied</th>
                <th scope="col">Catalog Unit Cost Total</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.name}>
                  <th scope="row">{vendor.name}</th>
                  <td>{vendor.itemCount}</td>
                  <td>${vendor.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Vendors;

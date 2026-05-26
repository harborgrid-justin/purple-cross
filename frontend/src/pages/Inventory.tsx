/**
 * WF-COMP-XXX | Inventory.tsx - Inventory
 * Purpose: React component for Inventory functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import '../styles/Page.css';

// Lazy load subfeature pages
const StockMonitoring = lazy(() => import('./inventory/StockMonitoring'));
const AutoReorder = lazy(() => import('./inventory/AutoReorder'));
const Vendors = lazy(() => import('./inventory/Vendors'));
const PurchaseOrders = lazy(() => import('./inventory/PurchaseOrders'));
const Valuation = lazy(() => import('./inventory/Valuation'));
const UsageAnalytics = lazy(() => import('./inventory/UsageAnalytics'));
const Barcode = lazy(() => import('./inventory/Barcode'));
const Equipment = lazy(() => import('./inventory/Equipment'));
const InventoryCreate = lazy(() => import('./inventory/InventoryCreate'));
const InventoryEdit = lazy(() => import('./inventory/InventoryEdit'));

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reorderPoint: number;
  unit?: string;
}

const InventoryList = () => {
  const { data, isLoading: loading, isError } = useInventory({ limit: 50 });

  const items = (data as { data?: InventoryItem[] } | undefined)?.data ?? [];

  return (
    <div className="table-container">
      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading inventory...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load inventory. Please try again.</p>
        </div>
      ) : items.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No inventory items found. Add an item to get started.</p>
        </div>
      ) : (
        <table className="data-table" role="table" aria-label="Inventory list">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Quantity</th>
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
                      to={`/inventory/${item.id}/edit`}
                      className="btn-action"
                      aria-label={`Edit ${item.name}`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Inventory = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📦</span> Inventory
        </h1>
        <Link to="/inventory/create" className="btn-primary" aria-label="Add inventory item">
          + Add Item
        </Link>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Inventory sections">
        <Link
          to="/inventory"
          className={`sub-nav-link ${location.pathname === '/inventory' ? 'active' : ''}`}
        >
          Stock Levels
        </Link>
        <Link
          to="/inventory/stock-monitoring"
          className={`sub-nav-link ${location.pathname.includes('/stock-monitoring') ? 'active' : ''}`}
        >
          Stock Monitoring
        </Link>
        <Link
          to="/inventory/auto-reorder"
          className={`sub-nav-link ${location.pathname.includes('/auto-reorder') ? 'active' : ''}`}
        >
          Auto Reordering
        </Link>
        <Link
          to="/inventory/vendors"
          className={`sub-nav-link ${location.pathname.includes('/vendors') ? 'active' : ''}`}
        >
          Vendors
        </Link>
        <Link
          to="/inventory/purchase-orders"
          className={`sub-nav-link ${location.pathname.includes('/purchase-orders') ? 'active' : ''}`}
        >
          Purchase Orders
        </Link>
        <Link
          to="/inventory/valuation"
          className={`sub-nav-link ${location.pathname.includes('/valuation') ? 'active' : ''}`}
        >
          Valuation
        </Link>
        <Link
          to="/inventory/analytics"
          className={`sub-nav-link ${location.pathname.includes('/analytics') ? 'active' : ''}`}
        >
          Usage Analytics
        </Link>
        <Link
          to="/inventory/barcode"
          className={`sub-nav-link ${location.pathname.includes('/barcode') ? 'active' : ''}`}
        >
          Barcode/RFID
        </Link>
        <Link
          to="/inventory/equipment"
          className={`sub-nav-link ${location.pathname.includes('/equipment') ? 'active' : ''}`}
        >
          Equipment & Assets
        </Link>
      </nav>

      <Suspense
        fallback={
          <div role="status">
            <p>Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<InventoryList />} />
          <Route path="/create" element={<InventoryCreate />} />
          <Route path="/:id/edit" element={<InventoryEdit />} />
          <Route path="/stock-monitoring" element={<StockMonitoring />} />
          <Route path="/auto-reorder" element={<AutoReorder />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/valuation" element={<Valuation />} />
          <Route path="/analytics" element={<UsageAnalytics />} />
          <Route path="/barcode" element={<Barcode />} />
          <Route path="/equipment" element={<Equipment />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Inventory;

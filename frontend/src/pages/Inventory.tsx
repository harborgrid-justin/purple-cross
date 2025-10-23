/**
 * WF-COMP-XXX | Inventory.tsx - Inventory
 * Purpose: React component for Inventory functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
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

const InventoryList = () => {
  const [inventory] = useState([
    { id: '1', item: 'Amoxicillin 500mg', quantity: 150, reorderLevel: 50, status: 'In Stock' },
    { id: '2', item: 'Prednisone 10mg', quantity: 25, reorderLevel: 30, status: 'Low Stock' },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Inventory list">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Quantity</th>
            <th scope="col">Reorder Level</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.item}</th>
              <td>{item.quantity}</td>
              <td>{item.reorderLevel}</td>
              <td>
                <span
                  className={`status-badge status-${item.status === 'Low Stock' ? 'warning' : 'confirmed'}`}
                >
                  {item.status}
                </span>
              </td>
              <td>
                <button className="btn-action" aria-label={`View details for ${item.item}`}>
                  View
                </button>
                <button className="btn-action" aria-label={`Adjust stock for ${item.item}`}>
                  Adjust
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        <button className="btn-primary" aria-label="Add inventory item">
          + Add Item
        </button>
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

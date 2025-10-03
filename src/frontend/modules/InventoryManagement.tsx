import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '../styles/Module.css';

const InventoryManagement: React.FC = () => {
  return (
    <div className="module-container">
      <Routes>
        <Route path="/" element={
          <>
            <div className="module-header">
              <h1 className="module-title">Inventory & Supply Chain Management</h1>
              <button className="btn-primary">Add Stock</button>
            </div>

            <div className="module-nav">
              <Link to="/inventory" className="tab-link active">Stock Levels</Link>
              <Link to="/inventory/reordering" className="tab-link">Auto Reorder</Link>
              <Link to="/inventory/vendors" className="tab-link">Vendors</Link>
              <Link to="/inventory/purchase-orders" className="tab-link">Purchase Orders</Link>
              <Link to="/inventory/valuation" className="tab-link">Valuation</Link>
              <Link to="/inventory/assets" className="tab-link">Asset Management</Link>
            </div>

            <div className="content-section">
              <div className="info-cards">
                <div className="info-card">
                  <h3>Stock Monitoring</h3>
                  <p>Real-time inventory tracking and alerts</p>
                  <ul>
                    <li>Real-time stock levels</li>
                    <li>Automatic reorder points</li>
                    <li>Expiration tracking</li>
                    <li>Barcode/RFID support</li>
                  </ul>
                </div>
                <div className="info-card">
                  <h3>Supply Chain</h3>
                  <p>Complete vendor and order management</p>
                  <ul>
                    <li>Vendor database</li>
                    <li>Purchase order management</li>
                    <li>Usage analytics</li>
                    <li>Equipment tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        } />
      </Routes>
    </div>
  );
};

export default InventoryManagement;

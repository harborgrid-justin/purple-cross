import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Inventory = () => {
  const [inventory] = useState([
    { id: '1', item: 'Amoxicillin 500mg', quantity: 150, reorderLevel: 50, status: 'In Stock' },
    { id: '2', item: 'Prednisone 10mg', quantity: 25, reorderLevel: 30, status: 'Low Stock' },
  ]);

  return (
    <div className="page">
      <header className="page-header">
        <h1><span aria-hidden="true">📦</span> Inventory</h1>
        <button className="btn-primary" aria-label="Add inventory item">
          + Add Item
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Inventory sections">
        <Link to="/inventory" className="sub-nav-link active">Stock Levels</Link>
        <Link to="/inventory/stock-monitoring" className="sub-nav-link">Stock Monitoring</Link>
        <Link to="/inventory/auto-reorder" className="sub-nav-link">Auto Reordering</Link>
        <Link to="/inventory/vendors" className="sub-nav-link">Vendors</Link>
        <Link to="/inventory/purchase-orders" className="sub-nav-link">Purchase Orders</Link>
        <Link to="/inventory/valuation" className="sub-nav-link">Valuation</Link>
        <Link to="/inventory/analytics" className="sub-nav-link">Usage Analytics</Link>
        <Link to="/inventory/barcode" className="sub-nav-link">Barcode/RFID</Link>
        <Link to="/inventory/equipment" className="sub-nav-link">Equipment & Assets</Link>
      </nav>

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
                  <span className={`status-badge status-${item.status === 'Low Stock' ? 'warning' : 'confirmed'}`}>
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
    </div>
  );
};

export default Inventory;

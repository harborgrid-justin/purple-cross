/**
 * WF-COMP-INVENTORY-005 | InventoryCreate.tsx - Create inventory page
 * Purpose: Form page for creating new inventory
 * Related: Inventory form component, inventory store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const InventoryCreate: React.FC = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📦</span> Create New Inventory
        </h1>
        <Link to="/inventory" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Create form for new inventory</p>
      </div>
    </div>
  );
};

export default InventoryCreate;

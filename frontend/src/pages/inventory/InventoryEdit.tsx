/**
 * WF-COMP-INVENTORY-006 | InventoryEdit.tsx - Edit inventory page
 * Purpose: Form page for editing existing inventory
 * Related: Inventory form component, inventory store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

const InventoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📦</span> Edit Inventory
        </h1>
        <Link to={`/inventory/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        <p>Edit form for inventory ID: {id}</p>
      </div>
    </div>
  );
};

export default InventoryEdit;

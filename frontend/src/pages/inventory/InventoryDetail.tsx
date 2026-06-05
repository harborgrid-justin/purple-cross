/**
 * WF-COMP-INVENTORY-004 | InventoryDetail.tsx - Inventory detail page
 * Purpose: Display detailed information for a single inventory item
 * Related: useInventoryItem, inventory routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInventoryItem } from '../../hooks/useInventory';
import '../../styles/Page.css';

interface InventoryDetailData {
  name?: string;
  sku?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  reorderPoint?: number;
  unitCost?: number;
  supplier?: string;
  expirationDate?: string;
}

const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: loading, isError } = useInventoryItem(id || '');
  const item = (data as { data?: InventoryDetailData } | undefined)?.data;

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📦</span> Inventory Details
        </h1>
        <div>
          <Link to={`/inventory/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/inventory" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading inventory item...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load inventory item. Please try again.</p>
        </div>
      ) : !item ? (
        <div className="alert alert-warning" role="alert">
          <p>Inventory item not found.</p>
        </div>
      ) : (
        <div className="content-section">
          <dl className="detail-list">
            <dt>Name</dt>
            <dd>{item.name ?? 'N/A'}</dd>
            <dt>SKU</dt>
            <dd>{item.sku ?? 'N/A'}</dd>
            <dt>Category</dt>
            <dd>{item.category ?? 'N/A'}</dd>
            <dt>Quantity</dt>
            <dd>
              {item.quantity ?? 0}
              {item.unit ? ` ${item.unit}` : ''}
            </dd>
            <dt>Reorder Point</dt>
            <dd>{item.reorderPoint ?? 'N/A'}</dd>
            <dt>Unit Cost</dt>
            <dd>{item.unitCost != null ? `$${Number(item.unitCost).toFixed(2)}` : 'N/A'}</dd>
            <dt>Supplier</dt>
            <dd>{item.supplier ?? 'N/A'}</dd>
            <dt>Expiration Date</dt>
            <dd>
              {item.expirationDate
                ? new Date(item.expirationDate).toLocaleDateString()
                : 'N/A'}
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
};

export default InventoryDetail;

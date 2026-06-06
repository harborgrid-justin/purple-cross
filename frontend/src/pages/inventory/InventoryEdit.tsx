/**
 * InventoryEdit.tsx - Edit inventory item page
 * Purpose: Form page for editing existing inventory items
 * Related: useInventoryItem, useUpdateInventoryItem
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInventoryItem, useUpdateInventoryItem } from '../../hooks/useInventory';
import '../../styles/Page.css';

interface InventoryItemResponse {
  data?: {
    name?: string;
    quantity?: number;
    reorderPoint?: number;
    unitCost?: number;
    supplier?: string;
    expirationDate?: string;
  };
}

interface InventoryFormData {
  name: string;
  quantity: string;
  reorderPoint: string;
  unitCost: string;
  supplier: string;
  expirationDate: string;
}

const InventoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading: fetchLoading } = useInventoryItem(id || '');
  const item = (response as InventoryItemResponse | undefined)?.data;
  const updateMutation = useUpdateInventoryItem();

  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    quantity: '',
    reorderPoint: '',
    unitCost: '',
    supplier: '',
    expirationDate: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        quantity: item.quantity != null ? String(item.quantity) : '',
        reorderPoint: item.reorderPoint != null ? String(item.reorderPoint) : '',
        unitCost: item.unitCost != null ? String(item.unitCost) : '',
        supplier: item.supplier || '',
        expirationDate: item.expirationDate
          ? new Date(item.expirationDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!id) return;

    const payload = {
      name: formData.name,
      quantity: formData.quantity !== '' ? Number(formData.quantity) : undefined,
      reorderPoint: formData.reorderPoint !== '' ? Number(formData.reorderPoint) : undefined,
      unitCost: formData.unitCost !== '' ? Number(formData.unitCost) : undefined,
      supplier: formData.supplier || undefined,
      expirationDate: formData.expirationDate || undefined,
    };

    updateMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          navigate('/inventory');
        },
      }
    );
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading inventory item...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Inventory item not found</p>
        </div>
        <Link to="/inventory" className="btn-secondary">
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Edit Inventory Item</h1>
        <p className="page-subtitle">Update stock details for {item.name}</p>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update inventory item'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min={0}
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reorderPoint">Reorder Point</label>
          <input
            type="number"
            id="reorderPoint"
            name="reorderPoint"
            min={0}
            value={formData.reorderPoint}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="unitCost">Unit Cost</label>
          <input
            type="number"
            id="unitCost"
            name="unitCost"
            min={0}
            step="0.01"
            value={formData.unitCost}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="supplier">Supplier</label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="expirationDate">Expiration Date</label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/inventory" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default InventoryEdit;

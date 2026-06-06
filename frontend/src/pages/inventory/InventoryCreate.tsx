/**
 * InventoryCreate.tsx - Create inventory item page
 * Purpose: Validated form for creating new inventory items
 * Related: useZodForm, FormField, useCreateInventoryItem
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateInventoryItem } from '../../hooks/useInventory';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-inventory validation: name, sku, category,
// quantity, unit, reorderPoint and unitCost are required.
const inventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity must be 0 or more'),
  unit: z.string().min(1, 'Unit is required'),
  reorderPoint: z.coerce
    .number()
    .int('Reorder point must be a whole number')
    .min(0, 'Reorder point must be 0 or more'),
  unitCost: z.coerce.number().min(0, 'Unit cost must be 0 or more'),
  supplier: z.string().optional(),
  expirationDate: z.string().optional(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

const InventoryCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateInventoryItem();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(inventorySchema);

  const onSubmit = (data: InventoryFormData): void => {
    const payload = {
      ...data,
      supplier: data.supplier || undefined,
      expirationDate: data.expirationDate || undefined,
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        navigate('/inventory');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Add Inventory Item</h1>
        <p className="page-subtitle">Register a new item in stock</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create inventory item'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="Name" registration={register('name')} error={errors.name} required />
        <FormField label="SKU" registration={register('sku')} error={errors.sku} required />
        <FormField
          label="Category"
          registration={register('category')}
          error={errors.category}
          required
        />
        <FormField
          label="Quantity"
          type="number"
          registration={register('quantity')}
          error={errors.quantity}
          required
        />
        <FormField
          label="Unit"
          registration={register('unit')}
          error={errors.unit}
          placeholder="e.g. tablets, bottles"
          required
        />
        <FormField
          label="Reorder Point"
          type="number"
          registration={register('reorderPoint')}
          error={errors.reorderPoint}
          required
        />
        <FormField
          label="Unit Cost"
          type="number"
          registration={register('unitCost')}
          error={errors.unitCost}
          required
        />
        <FormField label="Supplier" registration={register('supplier')} error={errors.supplier} />
        <FormField
          label="Expiration Date"
          type="date"
          registration={register('expirationDate')}
          error={errors.expirationDate}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Add Item'}
          </button>
          <Link to="/inventory" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default InventoryCreate;

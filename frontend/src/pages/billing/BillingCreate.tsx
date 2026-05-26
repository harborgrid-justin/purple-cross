/**
 * BillingCreate.tsx - Create invoice page
 * Purpose: Validated form for creating new invoices
 * Related: useZodForm, FormField, useCreateInvoice
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateInvoice } from '../../hooks/useInvoices';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-invoice validation: clientId, invoiceNumber,
// invoiceDate, dueDate, subtotal and total are required.
const invoiceSchema = z.object({
  clientId: z.string().uuid('Client ID must be a valid UUID'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  subtotal: z.coerce.number().min(0, 'Subtotal must be 0 or more'),
  tax: z.coerce.number().min(0, 'Tax must be 0 or more').optional(),
  total: z.coerce.number().min(0, 'Total must be 0 or more'),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

const BillingCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateInvoice();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(invoiceSchema);

  const onSubmit = (data: InvoiceFormData): void => {
    const payload = {
      ...data,
      notes: data.notes || undefined,
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        navigate('/billing');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Create Invoice</h1>
        <p className="page-subtitle">Generate a new client invoice</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create invoice'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Client ID"
          registration={register('clientId')}
          error={errors.clientId}
          required
        />
        <FormField
          label="Invoice Number"
          registration={register('invoiceNumber')}
          error={errors.invoiceNumber}
          required
        />
        <FormField
          label="Invoice Date"
          type="date"
          registration={register('invoiceDate')}
          error={errors.invoiceDate}
          required
        />
        <FormField
          label="Due Date"
          type="date"
          registration={register('dueDate')}
          error={errors.dueDate}
          required
        />
        <FormField
          label="Subtotal"
          type="number"
          registration={register('subtotal')}
          error={errors.subtotal}
          required
        />
        <FormField label="Tax" type="number" registration={register('tax')} error={errors.tax} />
        <FormField
          label="Total"
          type="number"
          registration={register('total')}
          error={errors.total}
          required
        />
        <FormField label="Notes" registration={register('notes')} error={errors.notes} />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Invoice'}
          </button>
          <Link to="/billing" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BillingCreate;

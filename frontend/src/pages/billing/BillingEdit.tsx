/**
 * BillingEdit.tsx - Edit invoice page
 * Purpose: Form page for editing existing invoices (status and notes)
 * Related: useInvoice, useUpdateInvoice
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInvoice, useUpdateInvoice } from '../../hooks/useInvoices';
import '../../styles/Page.css';

interface InvoiceResponse {
  data?: {
    invoiceNumber?: string;
    status?: string;
    notes?: string;
  };
}

interface InvoiceFormData {
  status: string;
  notes: string;
}

const BillingEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading: fetchLoading } = useInvoice(id || '');
  const invoice = (response as InvoiceResponse | undefined)?.data;
  const updateMutation = useUpdateInvoice();

  const [formData, setFormData] = useState<InvoiceFormData>({
    status: '',
    notes: '',
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        status: invoice.status || '',
        notes: invoice.notes || '',
      });
    }
  }, [invoice]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!id) return;

    const payload = {
      status: formData.status || undefined,
      notes: formData.notes || undefined,
    };

    updateMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          navigate('/billing');
        },
      }
    );
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Invoice not found</p>
        </div>
        <Link to="/billing" className="btn-secondary">
          Back to Billing
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Edit Invoice</h1>
        <p className="page-subtitle">Update invoice {invoice.invoiceNumber ?? ''}</p>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update invoice'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="">Select…</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/billing" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BillingEdit;

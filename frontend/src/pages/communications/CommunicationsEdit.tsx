/**
 * WF-COMP-COMMUNICATIONS-006 | CommunicationsEdit.tsx - Edit communications page
 * Purpose: Form page for editing existing communications
 * Related: Communications form component, communications store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCommunication, useUpdateCommunication } from '../../hooks/useCommunications';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend update-communication validation (status/readAt only).
const editSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  readAt: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

interface CommunicationRecord {
  status?: string;
  readAt?: string;
}

const STATUSES = ['sent', 'delivered', 'read', 'failed'].map((v) => ({ value: v, label: v }));

const CommunicationsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useCommunication(id || '');
  const updateMutation = useUpdateCommunication();

  const record = (data as { data?: CommunicationRecord } | undefined)?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(editSchema);

  useEffect(() => {
    if (record) {
      reset({
        status: record.status || 'sent',
        readAt: record.readAt ? new Date(record.readAt).toISOString().slice(0, 16) : '',
      });
    }
  }, [record, reset]);

  const onSubmit = (formData: EditFormData): void => {
    if (!id) return;
    const payload: { status: string; readAt?: string } = { status: formData.status };
    if (formData.readAt) payload.readAt = formData.readAt;
    updateMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => navigate(`/communications/${id}`),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading communication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📧</span> Edit Communication
        </h1>
        <Link to={`/communications/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update communication'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Status"
          registration={register('status')}
          error={errors.status}
          options={STATUSES}
          required
        />
        <FormField
          label="Read At"
          type="datetime-local"
          registration={register('readAt')}
          error={errors.readAt}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/communications/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CommunicationsEdit;

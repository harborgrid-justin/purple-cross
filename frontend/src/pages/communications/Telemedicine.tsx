/**
 * WF-COMP-XXX | Telemedicine.tsx - Telemedicine
 * Purpose: React component for Telemedicine functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import { z } from 'zod';
import { useCommunications, useCreateCommunication } from '../../hooks/useCommunications';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const CHANNEL_TYPE = 'telemedicine';

const composeSchema = z.object({
  clientId: z.string().uuid('Client ID must be a valid UUID'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Session notes are required'),
});

type ComposeData = z.infer<typeof composeSchema>;

interface CommunicationRow {
  id: string;
  subject?: string;
  message: string;
  status: string;
  sentAt?: string;
}

const Telemedicine: React.FC = () => {
  const { data, isLoading, isError } = useCommunications({ type: CHANNEL_TYPE, limit: 50 });
  const createMutation = useCreateCommunication();

  const rows = (data as { data?: CommunicationRow[] } | undefined)?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(composeSchema);

  const onSubmit = (form: ComposeData): void => {
    createMutation.mutate(
      {
        clientId: form.clientId,
        type: CHANNEL_TYPE,
        subject: form.subject,
        message: form.message,
        sentAt: new Date().toISOString(),
      },
      { onSuccess: () => reset({ clientId: '', subject: '', message: '' }) }
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Video Telemedicine</h1>
        <p className="page-subtitle">Schedule and review virtual consultation sessions</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to record session'}
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
          label="Session Subject"
          registration={register('subject')}
          error={errors.subject}
          required
        />
        <FormField
          label="Session Notes"
          registration={register('message')}
          error={errors.message}
          required
        />
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Recording...' : 'Record Session'}
          </button>
        </div>
      </form>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading sessions...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load sessions. Please try again.</p>
          </div>
        ) : rows.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No telemedicine sessions found. Record one above to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Telemedicine sessions list">
            <thead>
              <tr>
                <th scope="col">Subject</th>
                <th scope="col">Notes</th>
                <th scope="col">Status</th>
                <th scope="col">Recorded</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.subject || 'N/A'}</th>
                  <td>{row.message}</td>
                  <td>
                    <span className="status-badge status-confirmed">{row.status}</span>
                  </td>
                  <td>
                    {row.sentAt ? (
                      <time dateTime={row.sentAt}>{new Date(row.sentAt).toLocaleString()}</time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Telemedicine;

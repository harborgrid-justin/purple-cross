/**
 * WF-COMP-COMMUNICATIONS-005 | CommunicationsCreate.tsx - Create communications page
 * Purpose: Form page for creating new communications
 * Related: Communications form component, communications store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateCommunication } from '../../hooks/useCommunications';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-communication validation
// (clientId/type/subject/message/sentAt required).
const communicationSchema = z.object({
  clientId: z.string().uuid('Client ID must be a valid UUID'),
  type: z.string().min(1, 'Type is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  sentAt: z.string().min(1, 'Sent date is required'),
  status: z.string().optional(),
});

type CommunicationFormData = z.infer<typeof communicationSchema>;

const TYPES = ['email', 'sms', 'voice', 'social', 'telemedicine', 'notification'].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}));

const CommunicationsCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateCommunication();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(communicationSchema);

  const onSubmit = (data: CommunicationFormData): void => {
    createMutation.mutate(data, {
      onSuccess: (response) => {
        const id = (response as { data?: { id?: string } })?.data?.id;
        navigate(id ? `/communications/${id}` : '/communications');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📧</span> Create New Communication
        </h1>
        <p className="page-subtitle">Log a message sent to a client</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create communication'}
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
          label="Type"
          registration={register('type')}
          error={errors.type}
          options={TYPES}
          required
        />
        <FormField
          label="Subject"
          registration={register('subject')}
          error={errors.subject}
          required
        />
        <FormField
          label="Message"
          registration={register('message')}
          error={errors.message}
          required
        />
        <FormField
          label="Sent At"
          type="datetime-local"
          registration={register('sentAt')}
          error={errors.sentAt}
          required
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Communication'}
          </button>
          <Link to="/communications" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CommunicationsCreate;

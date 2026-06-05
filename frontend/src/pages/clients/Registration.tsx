/**
 * WF-COMP-XXX | Registration.tsx - Registration
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Registration functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateClient } from '../../hooks/useClients';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-client validation so users get immediate
// client-side feedback before onboarding a new client.
const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('A valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const createClientMutation = useCreateClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(clientSchema);

  const onSubmit = (data: ClientFormData): void => {
    createClientMutation.mutate(data, {
      onSuccess: (response) => {
        const clientId = (response as { data?: { id?: string } })?.data?.id;
        navigate(clientId ? `/clients/${clientId}` : '/clients');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Registration &amp; Profiles</h1>
        <p className="page-subtitle">Onboard a new client into the system</p>
      </header>

      {createClientMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createClientMutation.error instanceof Error
            ? createClientMutation.error.message
            : 'Failed to register client'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="First Name"
          registration={register('firstName')}
          error={errors.firstName}
          required
        />
        <FormField
          label="Last Name"
          registration={register('lastName')}
          error={errors.lastName}
          required
        />
        <FormField
          label="Email"
          type="email"
          registration={register('email')}
          error={errors.email}
          required
        />
        <FormField
          label="Phone"
          registration={register('phone')}
          error={errors.phone}
          required
        />
        <FormField label="Address" registration={register('address')} error={errors.address} />
        <FormField label="City" registration={register('city')} error={errors.city} />
        <FormField label="State" registration={register('state')} error={errors.state} />
        <FormField label="Zip Code" registration={register('zipCode')} error={errors.zipCode} />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createClientMutation.isPending}
          >
            {createClientMutation.isPending ? 'Registering...' : 'Register Client'}
          </button>
          <Link to="/clients" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Registration;

/**
 * WF-COMP-014 | PatientsCreate.tsx - Create patient page
 * Purpose: Form page for creating new patients (validated with Zod)
 * Related: useZodForm, FormField, TanStack Query hooks
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreatePatient } from '../../hooks/usePatients';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-patient validation (name/species/dateOfBirth/
// gender/ownerId required) so users get immediate client-side feedback.
const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  breed: z.string().optional(),
  microchipId: z.string().optional(),
  ownerId: z.string().uuid('Owner ID must be a valid UUID'),
});

type PatientFormData = z.infer<typeof patientSchema>;

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((v) => ({ value: v, label: v }));
const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' },
];

const PatientsCreate: React.FC = () => {
  const navigate = useNavigate();
  const createPatientMutation = useCreatePatient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(patientSchema);

  const onSubmit = (data: PatientFormData): void => {
    createPatientMutation.mutate(data, {
      onSuccess: (response) => {
        const patientId = (response as { data?: { id?: string } })?.data?.id;
        navigate(patientId ? `/patients/${patientId}` : '/patients');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Create New Patient</h1>
        <p className="page-subtitle">Register a new patient in the system</p>
      </header>

      {createPatientMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createPatientMutation.error instanceof Error
            ? createPatientMutation.error.message
            : 'Failed to create patient'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField label="Name" registration={register('name')} error={errors.name} required />
        <FormField
          label="Species"
          registration={register('species')}
          error={errors.species}
          options={SPECIES}
          required
        />
        <FormField
          label="Gender"
          registration={register('gender')}
          error={errors.gender}
          options={GENDERS}
          required
        />
        <FormField
          label="Date of Birth"
          type="date"
          registration={register('dateOfBirth')}
          error={errors.dateOfBirth}
          required
        />
        <FormField label="Breed" registration={register('breed')} error={errors.breed} />
        <FormField
          label="Microchip ID"
          registration={register('microchipId')}
          error={errors.microchipId}
        />
        <FormField
          label="Owner ID"
          registration={register('ownerId')}
          error={errors.ownerId}
          required
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createPatientMutation.isPending}
          >
            {createPatientMutation.isPending ? 'Creating...' : 'Create Patient'}
          </button>
          <Link to="/patients" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PatientsCreate;

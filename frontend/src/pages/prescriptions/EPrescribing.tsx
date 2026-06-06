/**
 * WF-COMP-XXX | EPrescribing.tsx - E Prescribing
 * Purpose: Validated electronic prescription form
 * Dependencies: useCreatePrescription, useZodForm, FormField
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreatePrescription } from '../../hooks/usePrescriptions';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-prescription validation: patientId, medicationId,
// prescribedById, prescriptionDate, dosage, frequency and duration required.
const prescriptionSchema = z.object({
  patientId: z.string().uuid('Patient ID must be a valid UUID'),
  medicationId: z.string().uuid('Medication ID must be a valid UUID'),
  prescribedById: z.string().uuid('Prescriber ID must be a valid UUID'),
  prescriptionDate: z.string().min(1, 'Prescription date is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional(),
  refills: z.coerce.number().int().min(0).optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

const EPrescribing: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreatePrescription();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(prescriptionSchema);

  const onSubmit = (data: PrescriptionFormData): void => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/prescriptions');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>E-Prescribing</h1>
        <p className="page-subtitle">Issue an electronic prescription</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create prescription'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Patient ID"
          registration={register('patientId')}
          error={errors.patientId}
          required
        />
        <FormField
          label="Medication ID"
          registration={register('medicationId')}
          error={errors.medicationId}
          required
        />
        <FormField
          label="Prescriber ID"
          registration={register('prescribedById')}
          error={errors.prescribedById}
          required
        />
        <FormField
          label="Prescription Date"
          type="date"
          registration={register('prescriptionDate')}
          error={errors.prescriptionDate}
          required
        />
        <FormField
          label="Dosage"
          registration={register('dosage')}
          error={errors.dosage}
          placeholder="e.g. 250mg"
          required
        />
        <FormField
          label="Frequency"
          registration={register('frequency')}
          error={errors.frequency}
          placeholder="e.g. Twice daily"
          required
        />
        <FormField
          label="Duration"
          registration={register('duration')}
          error={errors.duration}
          placeholder="e.g. 7 days"
          required
        />
        <FormField
          label="Instructions"
          registration={register('instructions')}
          error={errors.instructions}
        />
        <FormField
          label="Refills"
          type="number"
          registration={register('refills')}
          error={errors.refills}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Sending...' : 'Send Prescription'}
          </button>
          <Link to="/prescriptions" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EPrescribing;

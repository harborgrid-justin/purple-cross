/**
 * MedicalRecordsCreate.tsx - Create medical record page
 * Purpose: Validated form for creating new medical records
 * Related: useZodForm, FormField, useCreateMedicalRecord
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateMedicalRecord } from '../../hooks/useMedicalRecords';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-medical-record validation: patientId,
// veterinarianId, visitDate and chiefComplaint are required.
const medicalRecordSchema = z.object({
  patientId: z.string().uuid('Patient ID must be a valid UUID'),
  veterinarianId: z.string().uuid('Veterinarian ID must be a valid UUID'),
  visitDate: z.string().min(1, 'Visit date is required'),
  chiefComplaint: z.string().min(1, 'Chief complaint is required'),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

const MedicalRecordsCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateMedicalRecord();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(medicalRecordSchema);

  const onSubmit = (data: MedicalRecordFormData): void => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/medical-records');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Create Medical Record</h1>
        <p className="page-subtitle">Document a new patient visit</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to create medical record'}
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
          label="Veterinarian ID"
          registration={register('veterinarianId')}
          error={errors.veterinarianId}
          required
        />
        <FormField
          label="Visit Date"
          type="date"
          registration={register('visitDate')}
          error={errors.visitDate}
          required
        />
        <FormField
          label="Chief Complaint"
          registration={register('chiefComplaint')}
          error={errors.chiefComplaint}
          required
        />
        <FormField
          label="Diagnosis"
          registration={register('diagnosis')}
          error={errors.diagnosis}
        />
        <FormField
          label="Treatment"
          registration={register('treatment')}
          error={errors.treatment}
        />
        <FormField label="Notes" registration={register('notes')} error={errors.notes} />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Record'}
          </button>
          <Link to="/medical-records" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordsCreate;

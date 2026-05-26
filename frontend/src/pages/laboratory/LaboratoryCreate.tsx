/**
 * LaboratoryCreate.tsx - Order lab test page
 * Purpose: Validated form for ordering new lab tests
 * Related: useZodForm, FormField, useCreateLabTest
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateLabTest } from '../../hooks/useLabTests';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

// Mirrors the backend create-lab-test validation: patientId, orderedById,
// testName, testType and orderDate are required.
const labTestSchema = z.object({
  patientId: z.string().uuid('Patient ID must be a valid UUID'),
  orderedById: z.string().uuid('Ordered-by ID must be a valid UUID'),
  testName: z.string().min(1, 'Test name is required'),
  testType: z.string().min(1, 'Test type is required'),
  orderDate: z.string().min(1, 'Order date is required'),
  notes: z.string().optional(),
});

type LabTestFormData = z.infer<typeof labTestSchema>;

const LaboratoryCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateLabTest();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(labTestSchema);

  const onSubmit = (data: LabTestFormData): void => {
    const payload = {
      ...data,
      notes: data.notes || undefined,
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        navigate('/laboratory');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Order Lab Test</h1>
        <p className="page-subtitle">Request a new laboratory test</p>
      </header>

      {createMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Failed to order lab test'}
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
          label="Ordered By ID"
          registration={register('orderedById')}
          error={errors.orderedById}
          required
        />
        <FormField
          label="Test Name"
          registration={register('testName')}
          error={errors.testName}
          placeholder="e.g. Complete Blood Count"
          required
        />
        <FormField
          label="Test Type"
          registration={register('testType')}
          error={errors.testType}
          placeholder="e.g. Blood Work, Urinalysis"
          required
        />
        <FormField
          label="Order Date"
          type="date"
          registration={register('orderDate')}
          error={errors.orderDate}
          required
        />
        <FormField label="Notes" registration={register('notes')} error={errors.notes} />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? 'Ordering...' : 'Order Test'}
          </button>
          <Link to="/laboratory" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LaboratoryCreate;

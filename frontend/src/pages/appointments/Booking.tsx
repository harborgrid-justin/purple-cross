/**
 * WF-COMP-XXX | Booking.tsx - Booking
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Booking functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateAppointment } from '../../hooks/useAppointments';
import { usePatients } from '../../hooks/usePatients';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

interface PatientOption {
  id: string;
  name: string;
  species: string;
}

// Mirrors the backend create-appointment validation so users get immediate
// client-side feedback before scheduling.
const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  appointmentType: z.string().min(1, 'Appointment type is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  reason: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const APPOINTMENT_TYPES = [
  'wellness-exam',
  'sick-visit',
  'surgery',
  'dental-cleaning',
  'follow-up',
].map((v) => ({ value: v, label: v.replace('-', ' ') }));

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const createAppointmentMutation = useCreateAppointment();

  const { data: patientsData } = usePatients({ limit: 100 });
  const patients = (patientsData as { data?: PatientOption[] } | undefined)?.data ?? [];
  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.species})` }));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(appointmentSchema);

  const onSubmit = (data: AppointmentFormData): void => {
    createAppointmentMutation.mutate(data, {
      onSuccess: (response) => {
        const appointmentId = (response as { data?: { id?: string } })?.data?.id;
        navigate(appointmentId ? `/appointments/${appointmentId}` : '/appointments');
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Appointment Booking</h1>
        <p className="page-subtitle">Schedule a new appointment for a patient</p>
      </header>

      {createAppointmentMutation.isError && (
        <div className="alert alert-error" role="alert">
          {createAppointmentMutation.error instanceof Error
            ? createAppointmentMutation.error.message
            : 'Failed to book appointment'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Patient"
          registration={register('patientId')}
          error={errors.patientId}
          options={patientOptions}
          required
        />
        <FormField
          label="Appointment Type"
          registration={register('appointmentType')}
          error={errors.appointmentType}
          options={APPOINTMENT_TYPES}
          required
        />
        <FormField
          label="Start Time"
          type="datetime-local"
          registration={register('startTime')}
          error={errors.startTime}
          required
        />
        <FormField
          label="End Time"
          type="datetime-local"
          registration={register('endTime')}
          error={errors.endTime}
          required
        />
        <FormField label="Reason" registration={register('reason')} error={errors.reason} />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || createAppointmentMutation.isPending}
          >
            {createAppointmentMutation.isPending ? 'Booking...' : 'Book Appointment'}
          </button>
          <Link to="/appointments" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Booking;

/**
 * WF-COMP-XXX | Reminders.tsx - Reminders
 * Purpose: React component for Reminders functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { usePatients } from '../../hooks/usePatients';
import {
  usePatientReminders,
  useCreatePatientReminder,
  useCompletePatientReminder,
} from '../../hooks/usePatientReminders';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

interface PatientOption {
  id: string;
  name: string;
  species: string;
}

interface ReminderRow {
  id: string;
  patientId: string;
  type: string;
  dueDate: string;
  notes?: string;
  status?: string;
  patient?: { name: string };
}

const reminderSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  type: z.string().min(1, 'Reminder type is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

const REMINDER_TYPES = ['vaccination', 'checkup', 'medication', 'follow-up'].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}));

const PatientReminders = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: patientsData } = usePatients({ limit: 100 });
  const patients = (patientsData as { data?: PatientOption[] } | undefined)?.data ?? [];
  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} (${p.species})` }));

  const { data, isLoading, isError } = usePatientReminders({ limit: 100 });
  const reminders = (data as { data?: ReminderRow[] } | undefined)?.data ?? [];

  const createReminder = useCreatePatientReminder();
  const completeReminder = useCompletePatientReminder();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(reminderSchema);

  const onSubmit = (formData: ReminderFormData): void => {
    createReminder.mutate(formData, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Patient Reminders &amp; Alerts</h1>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm((prev) => !prev)}
          aria-expanded={showForm}
        >
          {showForm ? 'Close Form' : '+ Create Reminder'}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
          {createReminder.isError && (
            <div className="alert alert-error" role="alert">
              {createReminder.error instanceof Error
                ? createReminder.error.message
                : 'Failed to create reminder'}
            </div>
          )}
          <FormField
            label="Patient"
            registration={register('patientId')}
            error={errors.patientId}
            options={patientOptions}
            required
          />
          <FormField
            label="Reminder Type"
            registration={register('type')}
            error={errors.type}
            options={REMINDER_TYPES}
            required
          />
          <FormField
            label="Due Date"
            type="date"
            registration={register('dueDate')}
            error={errors.dueDate}
            required
          />
          <FormField label="Notes" registration={register('notes')} error={errors.notes} />
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || createReminder.isPending}
            >
              {createReminder.isPending ? 'Creating...' : 'Create Reminder'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                reset();
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading reminders...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load reminders. Please try again.</p>
          </div>
        ) : reminders.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No reminders found. Create a reminder to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Patient reminders">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Type</th>
                <th scope="col">Due Date</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => {
                const status = reminder.status ?? 'pending';
                return (
                  <tr key={reminder.id}>
                    <th scope="row">{reminder.patient?.name ?? reminder.patientId}</th>
                    <td>{reminder.type}</td>
                    <td>
                      <time dateTime={reminder.dueDate}>
                        {new Date(reminder.dueDate).toLocaleDateString()}
                      </time>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${status}`}
                        role="status"
                        aria-label={`Status: ${status}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>{reminder.notes || 'N/A'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-action"
                        onClick={() => completeReminder.mutate(reminder.id)}
                        disabled={completeReminder.isPending || status === 'completed'}
                        aria-label={`Mark reminder for ${reminder.patient?.name ?? 'patient'} complete`}
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientReminders;

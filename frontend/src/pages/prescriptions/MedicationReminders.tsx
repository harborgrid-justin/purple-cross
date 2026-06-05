/**
 * WF-COMP-XXX | MedicationReminders.tsx - Medication Reminders
 * Purpose: List patient medication reminders and mark them complete
 * Dependencies: usePatientReminders, useCompletePatientReminder
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { usePatientReminders, useCompletePatientReminder } from '../../hooks/usePatientReminders';
import '../../styles/Page.css';

interface ReminderRow {
  id: string;
  type?: string;
  message?: string;
  dueDate?: string;
  status?: string;
  patient?: { name: string };
}

const MedicationReminders = () => {
  const { data, isLoading: loading, isError } = usePatientReminders({ limit: 50 });
  const complete = useCompletePatientReminder();

  const reminders = (data as { data?: ReminderRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Medication Reminders</h1>
        <p className="page-subtitle">Upcoming medication and refill reminders</p>
      </header>

      {complete.isError && (
        <div className="alert alert-error" role="alert">
          {complete.error instanceof Error
            ? complete.error.message
            : 'Failed to complete reminder'}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading reminders...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load reminders. Please try again.</p>
          </div>
        ) : reminders.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No reminders found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Medication reminders">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Type</th>
                <th scope="col">Message</th>
                <th scope="col">Due Date</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => (
                <tr key={reminder.id}>
                  <th scope="row">{reminder.patient?.name ?? 'Unknown'}</th>
                  <td>{reminder.type ?? 'N/A'}</td>
                  <td>{reminder.message ?? '—'}</td>
                  <td>
                    {reminder.dueDate
                      ? new Date(reminder.dueDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${reminder.status ?? 'pending'}`}
                      role="status"
                      aria-label={`Status: ${reminder.status ?? 'unknown'}`}
                    >
                      {reminder.status ?? 'N/A'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => complete.mutate(reminder.id)}
                      disabled={complete.isPending}
                      aria-label="Mark reminder complete"
                    >
                      Complete
                    </button>
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

export default MedicationReminders;

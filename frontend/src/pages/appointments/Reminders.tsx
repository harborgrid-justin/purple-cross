/**
 * WF-COMP-XXX | Reminders.tsx - Reminders
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Reminders functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { usePatientReminders, useCompletePatientReminder } from '../../hooks/usePatientReminders';
import '../../styles/Page.css';

interface ReminderRow {
  id: string;
  patientId: string;
  type: string;
  dueDate: string;
  status?: string;
  notes?: string;
  patient?: { name: string };
}

const Reminders = () => {
  const { data, isLoading, isError } = usePatientReminders({ limit: 100 });
  const reminders = (data as { data?: ReminderRow[] } | undefined)?.data ?? [];
  const completeReminder = useCompletePatientReminder();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Reminder System</h1>
        <p className="page-subtitle">Track upcoming reminders and confirm completion</p>
      </header>

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
            <p>No reminders scheduled.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Appointment reminders">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Type</th>
                <th scope="col">Due Date</th>
                <th scope="col">Status</th>
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

export default Reminders;

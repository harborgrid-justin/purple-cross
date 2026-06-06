/**
 * WF-COMP-XXX | Waitlist.tsx - Waitlist
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Waitlist functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import {
  useWaitlist,
  useNotifyWaitlistItem,
  useBookWaitlistItem,
  useCancelWaitlistItem,
} from '../../hooks/useWaitlist';
import '../../styles/Page.css';

interface WaitlistRow {
  id: string;
  priority?: number;
  status?: string;
  preferredTime?: string;
  createdAt: string;
  patient?: { name: string; species: string };
  client?: { firstName: string; lastName: string };
}

const Waitlist = () => {
  const { data, isLoading, isError } = useWaitlist({ limit: 100 });
  const items = (data as { data?: WaitlistRow[] } | undefined)?.data ?? [];

  const notifyItem = useNotifyWaitlistItem();
  const bookItem = useBookWaitlistItem();
  const cancelItem = useCancelWaitlistItem();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Waitlist Management</h1>
        <p className="page-subtitle">
          Fill last-minute openings by notifying and booking waitlisted clients
        </p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading waitlist...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load waitlist. Please try again.</p>
          </div>
        ) : items.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>The waitlist is currently empty.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Waitlist">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Client</th>
                <th scope="col">Priority</th>
                <th scope="col">Preferred Time</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const status = item.status ?? 'waiting';
                const isPending =
                  notifyItem.isPending || bookItem.isPending || cancelItem.isPending;
                return (
                  <tr key={item.id}>
                    <th scope="row">
                      {item.patient ? `${item.patient.name} (${item.patient.species})` : 'N/A'}
                    </th>
                    <td>
                      {item.client ? `${item.client.firstName} ${item.client.lastName}` : 'N/A'}
                    </td>
                    <td>{item.priority ?? 'Normal'}</td>
                    <td>{item.preferredTime || 'Any'}</td>
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
                        onClick={() => notifyItem.mutate(item.id)}
                        disabled={isPending}
                        aria-label={`Notify ${item.client?.firstName ?? 'client'}`}
                      >
                        Notify
                      </button>
                      <button
                        type="button"
                        className="btn-action"
                        onClick={() => bookItem.mutate({ id: item.id, appointmentData: {} })}
                        disabled={isPending}
                        aria-label={`Book ${item.client?.firstName ?? 'client'}`}
                      >
                        Book
                      </button>
                      <button
                        type="button"
                        className="btn-action"
                        onClick={() => cancelItem.mutate(item.id)}
                        disabled={isPending}
                        aria-label={`Cancel waitlist entry for ${item.client?.firstName ?? 'client'}`}
                      >
                        Cancel
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

export default Waitlist;

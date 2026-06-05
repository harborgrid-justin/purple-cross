/**
 * WF-COMP-XXX | Feedback.tsx - Feedback
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Feedback functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useFeedback, useNPSScore } from '../../hooks/useFeedback';
import '../../styles/Page.css';

interface FeedbackRow {
  id: string;
  rating?: number;
  comment?: string;
  status?: string;
  createdAt: string;
  client?: { firstName: string; lastName: string };
}

const Feedback = () => {
  const { data, isLoading, isError } = useFeedback({ limit: 100 });
  const { data: npsData } = useNPSScore();

  const feedback = (data as { data?: FeedbackRow[] } | undefined)?.data ?? [];
  const npsScore = (npsData as { data?: { score?: number } } | undefined)?.data?.score;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Feedback &amp; Surveys</h1>
        {typeof npsScore === 'number' && (
          <p className="page-subtitle">Current NPS Score: {npsScore}</p>
        )}
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading feedback...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load feedback. Please try again.</p>
          </div>
        ) : feedback.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No feedback submitted yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Client feedback">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Client</th>
                <th scope="col">Rating</th>
                <th scope="col">Comment</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => {
                const status = item.status ?? 'new';
                return (
                  <tr key={item.id}>
                    <th scope="row">
                      <time dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </time>
                    </th>
                    <td>
                      {item.client
                        ? `${item.client.firstName} ${item.client.lastName}`
                        : 'Anonymous'}
                    </td>
                    <td>{typeof item.rating === 'number' ? `${item.rating}/5` : 'N/A'}</td>
                    <td>{item.comment || 'N/A'}</td>
                    <td>
                      <span
                        className={`status-badge status-${status}`}
                        role="status"
                        aria-label={`Status: ${status}`}
                      >
                        {status}
                      </span>
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

export default Feedback;

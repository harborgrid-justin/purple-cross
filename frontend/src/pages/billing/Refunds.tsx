/**
 * WF-COMP-XXX | Refunds.tsx - Refunds
 * Purpose: List refund requests and process them
 * Dependencies: useRefunds, useProcessRefund
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useRefunds, useProcessRefund } from '../../hooks/useRefunds';
import '../../styles/Page.css';

interface RefundRow {
  id: string;
  amount?: number;
  reason?: string;
  status: string;
  createdAt?: string;
  client?: { firstName: string; lastName: string };
}

const Refunds = () => {
  const { data, isLoading: loading, isError } = useRefunds({ limit: 50 });
  const processRefund = useProcessRefund();

  const refunds = (data as { data?: RefundRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Refund &amp; Credit Management</h1>
        <p className="page-subtitle">Review and process refund requests</p>
      </header>

      {processRefund.isError && (
        <div className="alert alert-error" role="alert">
          {processRefund.error instanceof Error
            ? processRefund.error.message
            : 'Failed to process refund'}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading refunds...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load refunds. Please try again.</p>
          </div>
        ) : refunds.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No refunds found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Refunds">
            <thead>
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Amount</th>
                <th scope="col">Reason</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund) => (
                <tr key={refund.id}>
                  <th scope="row">
                    {refund.client
                      ? `${refund.client.firstName} ${refund.client.lastName}`
                      : 'Unknown'}
                  </th>
                  <td>
                    {refund.amount != null ? `$${Number(refund.amount).toFixed(2)}` : 'N/A'}
                  </td>
                  <td>{refund.reason ?? 'N/A'}</td>
                  <td>
                    <span
                      className={`status-badge status-${refund.status}`}
                      role="status"
                      aria-label={`Status: ${refund.status}`}
                    >
                      {refund.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => processRefund.mutate(refund.id)}
                      disabled={processRefund.isPending}
                      aria-label="Process refund"
                    >
                      Process
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

export default Refunds;

/**
 * WF-COMP-XXX | Estimates.tsx - Estimates
 * Purpose: List estimates and approve, reject, or convert them to invoices
 * Dependencies: useEstimates, useApproveEstimate, useRejectEstimate, useConvertEstimateToInvoice
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import {
  useEstimates,
  useApproveEstimate,
  useRejectEstimate,
  useConvertEstimateToInvoice,
} from '../../hooks/useEstimates';
import '../../styles/Page.css';

interface EstimateRow {
  id: string;
  estimateNumber?: string;
  total?: number;
  status: string;
  client?: { firstName: string; lastName: string };
}

const Estimates = () => {
  const { data, isLoading: loading, isError } = useEstimates({ limit: 50 });
  const approve = useApproveEstimate();
  const reject = useRejectEstimate();
  const convert = useConvertEstimateToInvoice();

  const estimates = (data as { data?: EstimateRow[] } | undefined)?.data ?? [];
  const busy = approve.isPending || reject.isPending || convert.isPending;
  const actionError = approve.error || reject.error || convert.error;
  const hasError = approve.isError || reject.isError || convert.isError;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Estimates &amp; Quotes</h1>
        <p className="page-subtitle">Approve, reject, or convert client estimates</p>
      </header>

      {hasError && (
        <div className="alert alert-error" role="alert">
          {actionError instanceof Error ? actionError.message : 'Action failed. Please try again.'}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading estimates...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load estimates. Please try again.</p>
          </div>
        ) : estimates.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No estimates found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Estimates">
            <thead>
              <tr>
                <th scope="col">Estimate #</th>
                <th scope="col">Client</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((estimate) => (
                <tr key={estimate.id}>
                  <th scope="row">{estimate.estimateNumber ?? estimate.id.slice(0, 8)}</th>
                  <td>
                    {estimate.client
                      ? `${estimate.client.firstName} ${estimate.client.lastName}`
                      : 'Unknown'}
                  </td>
                  <td>
                    {estimate.total != null ? `$${Number(estimate.total).toFixed(2)}` : 'N/A'}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${estimate.status}`}
                      role="status"
                      aria-label={`Status: ${estimate.status}`}
                    >
                      {estimate.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => approve.mutate(estimate.id)}
                      disabled={busy}
                      aria-label="Approve estimate"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => reject.mutate(estimate.id)}
                      disabled={busy}
                      aria-label="Reject estimate"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => convert.mutate(estimate.id)}
                      disabled={busy}
                      aria-label="Convert estimate to invoice"
                    >
                      Convert
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

export default Estimates;

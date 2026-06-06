/**
 * WF-COMP-XXX | InsuranceClaims.tsx - Insurance Claims
 * Purpose: List insurance claims and submit them for processing
 * Dependencies: useInsuranceClaims, useProcessInsuranceClaim
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useInsuranceClaims, useProcessInsuranceClaim } from '../../hooks/useInsuranceClaims';
import '../../styles/Page.css';

interface InsuranceClaimRow {
  id: string;
  claimNumber?: string;
  provider?: string;
  amountClaimed?: number;
  status: string;
  client?: { firstName: string; lastName: string };
}

const InsuranceClaims = () => {
  const { data, isLoading: loading, isError } = useInsuranceClaims({ limit: 50 });
  const processClaim = useProcessInsuranceClaim();

  const claims = (data as { data?: InsuranceClaimRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Insurance Claims Management</h1>
        <p className="page-subtitle">Track and process pet insurance claims</p>
      </header>

      {processClaim.isError && (
        <div className="alert alert-error" role="alert">
          {processClaim.error instanceof Error
            ? processClaim.error.message
            : 'Failed to process claim'}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading claims...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load insurance claims. Please try again.</p>
          </div>
        ) : claims.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No insurance claims found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Insurance claims">
            <thead>
              <tr>
                <th scope="col">Claim #</th>
                <th scope="col">Client</th>
                <th scope="col">Provider</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <th scope="row">{claim.claimNumber ?? claim.id.slice(0, 8)}</th>
                  <td>
                    {claim.client
                      ? `${claim.client.firstName} ${claim.client.lastName}`
                      : 'Unknown'}
                  </td>
                  <td>{claim.provider ?? 'N/A'}</td>
                  <td>
                    {claim.amountClaimed != null
                      ? `$${Number(claim.amountClaimed).toFixed(2)}`
                      : 'N/A'}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${claim.status}`}
                      role="status"
                      aria-label={`Status: ${claim.status}`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-action"
                      onClick={() => processClaim.mutate(claim.id)}
                      disabled={processClaim.isPending}
                      aria-label={`Process claim ${claim.claimNumber ?? claim.id}`}
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

export default InsuranceClaims;

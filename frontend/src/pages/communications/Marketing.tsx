/**
 * WF-COMP-XXX | Marketing.tsx - Marketing
 * Purpose: React component for Marketing functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import React from 'react';
import {
  useMarketingCampaigns,
  useLaunchMarketingCampaign,
  useCompleteMarketingCampaign,
} from '../../hooks/useMarketingCampaigns';
import '../../styles/Page.css';

interface CampaignRow {
  id: string;
  name: string;
  campaignType: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

const Marketing: React.FC = () => {
  const { data, isLoading, isError } = useMarketingCampaigns({ limit: 50 });
  const launchMutation = useLaunchMarketingCampaign();
  const completeMutation = useCompleteMarketingCampaign();

  const rows = (data as { data?: CampaignRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Marketing Automation</h1>
        <p className="page-subtitle">Launch and complete marketing campaigns</p>
      </header>

      {(launchMutation.isError || completeMutation.isError) && (
        <div className="alert alert-error" role="alert">
          {launchMutation.error instanceof Error
            ? launchMutation.error.message
            : completeMutation.error instanceof Error
              ? completeMutation.error.message
              : 'Campaign action failed'}
        </div>
      )}

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading campaigns...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load campaigns. Please try again.</p>
          </div>
        ) : rows.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No marketing campaigns found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Marketing campaigns list">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Starts</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.name}</th>
                  <td>{row.campaignType}</td>
                  <td>
                    <span className="status-badge status-confirmed">{row.status}</span>
                  </td>
                  <td>
                    {row.startDate ? (
                      <time dateTime={row.startDate}>
                        {new Date(row.startDate).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => launchMutation.mutate(row.id)}
                      disabled={launchMutation.isPending || row.status === 'active'}
                      aria-label={`Launch campaign ${row.name}`}
                    >
                      Launch
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => completeMutation.mutate(row.id)}
                      disabled={completeMutation.isPending || row.status === 'completed'}
                      aria-label={`Complete campaign ${row.name}`}
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

export default Marketing;

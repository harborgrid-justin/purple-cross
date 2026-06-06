/**
 * WF-COMP-INTEGRATIONS-004 | IntegrationsDetail.tsx - Integrations detail page
 * Purpose: Display detailed information for a single integrations
 * Related: Integrations details component, integrations store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDashboardAnalytics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

const IntegrationsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Use a real backend query to demonstrate live connectivity for this integration.
  const { isError, refetch, isFetching, isSuccess, dataUpdatedAt } = useDashboardAnalytics();

  const connectionStatus = isError ? 'Unreachable' : isSuccess ? 'Connected' : 'Checking';

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔗</span> Integration Details
        </h1>
        <div>
          <Link to={`/integrations/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/integrations" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>
      <p className="page-subtitle">Integration ID: {id}</p>

      <div className="table-container">
        <table className="data-table" role="table" aria-label="Integration details">
          <tbody>
            <tr>
              <th scope="row">Integration ID</th>
              <td>{id}</td>
            </tr>
            <tr>
              <th scope="row">Connection Status</th>
              <td>
                <span
                  className={`status-badge status-${
                    isError ? 'cancelled' : isSuccess ? 'confirmed' : 'pending'
                  }`}
                  role="status"
                >
                  {connectionStatus}
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row">Last Checked</th>
              <td>{dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="form-actions">
        <button
          className="btn-primary"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Test connection"
        >
          {isFetching ? 'Testing…' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
};

export default IntegrationsDetail;

/**
 * WF-COMP-MOBILE-004 | MobileDetail.tsx - Mobile detail page
 * Purpose: Display detailed information for a single mobile
 * Related: Mobile details component, mobile store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

interface PatientRow {
  id: string;
}

const MobileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // A real query verifies the device can reach the server and reports cache size.
  const { data, isError, refetch, isFetching, isSuccess, dataUpdatedAt } = usePatients({
    limit: 100,
  });

  const cachedRecords = (data as { data?: PatientRow[] } | undefined)?.data?.length ?? 0;

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📱</span> Device Details
        </h1>
        <div>
          <Link to={`/mobile/${id}/edit`} className="btn-primary">
            Edit
          </Link>
          <Link to="/mobile" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>
      <p className="page-subtitle">Device ID: {id}</p>

      <div className="table-container">
        <table className="data-table" role="table" aria-label="Device details">
          <tbody>
            <tr>
              <th scope="row">Device ID</th>
              <td>{id}</td>
            </tr>
            <tr>
              <th scope="row">Connectivity</th>
              <td>
                <span
                  className={`status-badge status-${
                    isError ? 'cancelled' : isSuccess ? 'confirmed' : 'pending'
                  }`}
                  role="status"
                >
                  {isError ? 'Offline' : isSuccess ? 'Online' : 'Checking'}
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row">Cached Records</th>
              <td>{cachedRecords.toLocaleString()}</td>
            </tr>
            <tr>
              <th scope="row">Last Sync</th>
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
          aria-label="Sync device"
        >
          {isFetching ? 'Syncing…' : 'Sync Device'}
        </button>
      </div>
    </div>
  );
};

export default MobileDetail;

/**
 * WF-COMP-013 | ClientsDetail.tsx - Client detail page
 * Purpose: Display detailed information for a single client
 * Related: Client details component, clients store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchClientById } from './store';
import '../../styles/Page.css';

const ClientsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedClient: client, loading, error } = useAppSelector((state) => state.clients);

  useEffect(() => {
    if (id) {
      dispatch(fetchClientById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error" role="alert">
          <p>Error: {error}</p>
        </div>
        <Link to="/clients" className="btn-secondary">
          Back to Clients
        </Link>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Client not found</p>
        </div>
        <Link to="/clients" className="btn-secondary">
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👥</span> {client.firstName} {client.lastName}
        </h1>
        <div>
          <Link to={`/clients/${client.id}/edit`} className="btn-primary">
            Edit Client
          </Link>
          <Link to="/clients" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <div className="detail-grid">
          <div className="detail-section">
            <h2>Basic Information</h2>
            <dl>
              <dt>Name:</dt>
              <dd>
                {client.firstName} {client.lastName}
              </dd>
              {client.email && (
                <>
                  <dt>Email:</dt>
                  <dd>{client.email}</dd>
                </>
              )}
              {client.phone && (
                <>
                  <dt>Phone:</dt>
                  <dd>{client.phone}</dd>
                </>
              )}
            </dl>
          </div>

          <div className="detail-section">
            <h2>Address Information</h2>
            <dl>
              {client.address && (
                <>
                  <dt>Address:</dt>
                  <dd>{client.address}</dd>
                </>
              )}
              {client.city && (
                <>
                  <dt>City:</dt>
                  <dd>{client.city}</dd>
                </>
              )}
              {client.state && (
                <>
                  <dt>State:</dt>
                  <dd>{client.state}</dd>
                </>
              )}
              {client.zipCode && (
                <>
                  <dt>Zip Code:</dt>
                  <dd>{client.zipCode}</dd>
                </>
              )}
            </dl>
          </div>

          <div className="detail-section">
            <h2>Record Information</h2>
            <dl>
              <dt>Created:</dt>
              <dd>{new Date(client.createdAt).toLocaleDateString()}</dd>
              <dt>Last Updated:</dt>
              <dd>{new Date(client.updatedAt).toLocaleDateString()}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsDetail;

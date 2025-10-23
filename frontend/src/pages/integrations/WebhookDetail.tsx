/**
 * WF-COMP-XXX | WebhookDetail.tsx - Webhook Detail View
 * Purpose: View webhook details, delivery history, and statistics
 * Dependencies: React, API
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { webhooksApi } from '../../services/modules/webhooksApi';
import type {
  Webhook,
  WebhookDelivery,
  WebhookStats,
} from '../../services/modules/webhooksApi';
import '../../styles/Page.css';

const WebhookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (id) {
      fetchWebhookDetails();
    }
  }, [id, page]);

  const fetchWebhookDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [webhookData, deliveriesData, statsData] = await Promise.all([
        webhooksApi.getWebhookById(id),
        webhooksApi.getWebhookDeliveries(id, { page, limit: 10 }),
        webhooksApi.getWebhookStats(id),
      ]);

      setWebhook(webhookData);
      setDeliveries(deliveriesData.data);
      setTotalPages(deliveriesData.pagination.totalPages);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch webhook details');
    } finally {
      setLoading(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!id) return;
    try {
      await webhooksApi.testWebhook(id);
      alert('Test webhook queued successfully!');
      setTimeout(() => fetchWebhookDetails(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test webhook');
    }
  };

  const handleRegenerateSecret = async () => {
    if (!id || !window.confirm('Are you sure you want to regenerate the webhook secret?'))
      return;
    try {
      const updated = await webhooksApi.regenerateSecret(id);
      setWebhook(updated);
      alert('Secret regenerated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate secret');
    }
  };

  if (loading && !webhook) {
    return (
      <div className="page">
        <div className="content-section" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading webhook details...</p>
        </div>
      </div>
    );
  }

  if (!webhook) {
    return (
      <div className="page">
        <div className="content-section" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Webhook not found</p>
          <button className="btn-primary" onClick={() => navigate('/integrations/webhooks')}>
            Back to Webhooks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔗</span> {webhook.name}
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/integrations/webhooks')}>
            ← Back
          </button>
          <button className="btn-primary" onClick={handleTestWebhook}>
            Test Webhook
          </button>
        </div>
      </header>

      {error && (
        <div
          style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <strong>Error:</strong> {error}
          <button
            style={{ marginLeft: '1rem' }}
            className="btn-secondary"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Webhook Info */}
      <div className="content-section">
        <h2>Webhook Details</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong>URL:</strong>
            <p style={{ margin: '0.25rem 0', wordBreak: 'break-all' }}>{webhook.url}</p>
          </div>
          <div>
            <strong>Status:</strong>
            <p style={{ margin: '0.25rem 0' }}>
              <span
                className={`status-badge ${webhook.active ? 'status-confirmed' : 'status-cancelled'}`}
              >
                {webhook.active ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
          <div>
            <strong>Subscribed Events ({webhook.events.length}):</strong>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '0.5rem',
              }}
            >
              {webhook.events.map((event) => (
                <span
                  key={event}
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
          <div>
            <strong>Secret:</strong>
            <p style={{ margin: '0.25rem 0', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {webhook.secret}
            </p>
            <button className="btn-secondary" onClick={handleRegenerateSecret}>
              Regenerate Secret
            </button>
          </div>
          <div>
            <strong>Created:</strong>
            <p style={{ margin: '0.25rem 0' }}>
              {new Date(webhook.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="content-section">
          <h2>Delivery Statistics</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.total}</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>Total</p>
            </div>
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>{stats.success}</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>Success</p>
            </div>
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#ef4444' }}>{stats.failed}</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>Failed</p>
            </div>
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.successRate}%</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>Success Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery History */}
      <div className="content-section">
        <h2>Delivery History</h2>
        {deliveries.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            No deliveries yet
          </p>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Status</th>
                    <th>Attempt</th>
                    <th>Status Code</th>
                    <th>Created</th>
                    <th>Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td>{delivery.event}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            delivery.status === 'success'
                              ? 'status-confirmed'
                              : delivery.status === 'failed'
                                ? 'status-cancelled'
                                : 'status-pending'
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </td>
                      <td>
                        {delivery.attempt}/{delivery.maxAttempts}
                      </td>
                      <td>{delivery.statusCode || '-'}</td>
                      <td>{new Date(delivery.createdAt).toLocaleString()}</td>
                      <td>
                        {delivery.deliveredAt
                          ? new Date(delivery.deliveredAt).toLocaleString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem',
                }}
              >
                <button
                  className="btn-secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span style={{ padding: '0.5rem' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn-secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WebhookDetail;

/**
 * WF-COMP-XXX | Webhooks.tsx - Webhooks Management
 * Purpose: Webhook subscription management interface
 * Dependencies: React, API
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { webhooksApi } from '../../services/modules/webhooksApi';
import type { Webhook, CreateWebhookData, WebhookStats } from '../../services/modules/webhooksApi';
import '../../styles/Page.css';

const Webhooks = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [formData, setFormData] = useState<CreateWebhookData>({
    name: '',
    url: '',
    events: [],
    active: true,
  });

  const [availableEvents] = useState([
    'patient.created',
    'patient.updated',
    'patient.deleted',
    'client.created',
    'client.updated',
    'client.deleted',
    'appointment.created',
    'appointment.updated',
    'appointment.cancelled',
    'appointment.completed',
    'invoice.created',
    'invoice.paid',
    'invoice.overdue',
    'medical_record.created',
    'medical_record.updated',
    'lab_test.ordered',
    'lab_test.completed',
    'prescription.created',
    'prescription.refilled',
    'webhook.test',
  ]);

  // Fetch webhooks on mount
  useEffect(() => {
    fetchWebhooks();
    fetchStats();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await webhooksApi.getWebhooks();
      setWebhooks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch webhooks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const analytics = await webhooksApi.getWebhookAnalytics();
      setStats(analytics);
    } catch (err) {
      console.error('Failed to fetch webhook stats:', err);
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await webhooksApi.createWebhook(formData);
      setShowCreateForm(false);
      setFormData({ name: '', url: '', events: [], active: true });
      fetchWebhooks();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create webhook');
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this webhook?')) return;
    try {
      await webhooksApi.deleteWebhook(id);
      fetchWebhooks();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete webhook');
    }
  };

  const handleTestWebhook = async (id: string) => {
    try {
      await webhooksApi.testWebhook(id);
      alert('Test webhook queued successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test webhook');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await webhooksApi.updateWebhook(id, { active: !active });
      fetchWebhooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update webhook');
    }
  };

  const handleEventToggle = (event: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }));
  };

  if (loading) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>
            <span aria-hidden="true">🔗</span> Webhook Management
          </h1>
        </header>
        <div className="content-section" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading webhooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔗</span> Webhook Management
        </h1>
        <button
          className="btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
          aria-label="Create new webhook"
        >
          + Create Webhook
        </button>
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

      {/* Stats Cards Section */}
      {stats && (
        <div className="content-section">
          <div
            className="info-cards"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '2rem' }}>
                {stats.total}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Deliveries</p>
            </div>
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3
                style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '2rem', color: '#10b981' }}
              >
                {stats.success}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Successful</p>
            </div>
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3
                style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '2rem', color: '#ef4444' }}
              >
                {stats.failed}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Failed</p>
            </div>
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '2rem' }}>
                {stats.successRate}%
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Success Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Form (conditional) */}
      {showCreateForm && (
        <div
          className="content-section"
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--primary-color)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Create New Webhook</h2>
          <form onSubmit={handleCreateWebhook}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="webhook-name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Name *
              </label>
              <input
                type="text"
                id="webhook-name"
                placeholder="e.g., Patient Sync Webhook"
                style={{ width: '100%', padding: '0.5rem' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="webhook-url" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Webhook URL *
              </label>
              <input
                type="url"
                id="webhook-url"
                placeholder="https://api.example.com/webhooks/endpoint"
                style={{ width: '100%', padding: '0.5rem' }}
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Subscribe to Events * (Select at least one)
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '0.5rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {availableEvents.map((event) => (
                  <label
                    key={event}
                    style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
                  >
                    <input
                      type="checkbox"
                      style={{ marginRight: '0.5rem' }}
                      checked={formData.events.includes(event)}
                      onChange={() => handleEventToggle(event)}
                    />
                    {event}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary" disabled={formData.events.length === 0}>
                Create Webhook
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ name: '', url: '', events: [], active: true });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Webhooks List */}
      <div className="content-section">
        <h2>Webhooks ({webhooks.length})</h2>
        {webhooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <p>No webhooks configured yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table" role="table" aria-label="Webhooks list">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">URL</th>
                  <th scope="col">Events</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <th scope="row">{webhook.name}</th>
                    <td
                      style={{
                        fontSize: '0.875rem',
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={webhook.url}
                    >
                      {webhook.url}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                        title={webhook.events.join(', ')}
                      >
                        {webhook.events.length} events
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-badge ${webhook.active ? 'status-confirmed' : 'status-cancelled'}`}
                        onClick={() => handleToggleActive(webhook.id, webhook.active)}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title={`Click to ${webhook.active ? 'deactivate' : 'activate'}`}
                      >
                        {webhook.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>{new Date(webhook.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/integrations/webhooks/${webhook.id}`} className="btn-action">
                        View
                      </Link>
                      <button
                        className="btn-action"
                        onClick={() => handleTestWebhook(webhook.id)}
                        aria-label={`Test ${webhook.name}`}
                      >
                        Test
                      </button>
                      <button
                        className="btn-action"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        aria-label={`Delete ${webhook.name}`}
                        style={{ color: '#ef4444' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Webhooks;

/**
 * WF-COMP-XXX | Webhooks.tsx - Webhooks Management
 * Purpose: Webhook subscription management interface
 * Dependencies: React, API
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import '../../styles/Page.css';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

const Webhooks = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [webhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Patient Management Sync',
      url: 'https://api.example.com/webhooks/patients',
      events: ['patient.created', 'patient.updated'],
      active: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Appointment Notifications',
      url: 'https://api.example.com/webhooks/appointments',
      events: ['appointment.created', 'appointment.cancelled'],
      active: true,
      createdAt: '2024-01-16',
    },
    {
      id: '3',
      name: 'Billing Integration',
      url: 'https://api.example.com/webhooks/billing',
      events: ['invoice.created', 'invoice.paid'],
      active: false,
      createdAt: '2024-01-10',
    },
  ]);

  const [availableEvents] = useState([
    'patient.created',
    'patient.updated',
    'patient.deleted',
    'appointment.created',
    'appointment.updated',
    'appointment.cancelled',
    'invoice.created',
    'invoice.paid',
    'invoice.overdue',
    'medical_record.created',
    'lab_test.completed',
    'prescription.created',
  ]);

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

      {/* Info Cards Section */}
      <div className="content-section">
        <div
          className="info-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              <span aria-hidden="true">📡</span> Webhook Features
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>Event-driven notifications</li>
              <li>Automatic retry with backoff</li>
              <li>HMAC signature security</li>
              <li>Real-time delivery tracking</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              <span aria-hidden="true">🎯</span> Available Events
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Subscribe to {availableEvents.length} event types across patients, appointments,
              billing, and more.
            </p>
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              <span aria-hidden="true">🔒</span> Security
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>Secure secret keys</li>
              <li>HMAC-SHA256 signatures</li>
              <li>Easy secret regeneration</li>
              <li>Delivery verification</li>
            </ul>
          </div>
        </div>
      </div>

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
          <form>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="webhook-name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Name
              </label>
              <input
                type="text"
                id="webhook-name"
                placeholder="e.g., Patient Sync Webhook"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="webhook-url" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Webhook URL
              </label>
              <input
                type="url"
                id="webhook-url"
                placeholder="https://api.example.com/webhooks/endpoint"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Subscribe to Events
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {availableEvents.slice(0, 6).map((event) => (
                  <label
                    key={event}
                    style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
                  >
                    <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                    {event}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary">
                Create Webhook
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Webhooks List */}
      <div className="content-section">
        <h2>Active Webhooks</h2>
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
                  <td style={{ fontSize: '0.875rem', maxWidth: '300px', overflow: 'hidden' }}>
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
                    >
                      {webhook.events.length} events
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${webhook.active ? 'status-confirmed' : 'status-cancelled'}`}
                    >
                      {webhook.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{webhook.createdAt}</td>
                  <td>
                    <button className="btn-action" aria-label={`Edit ${webhook.name}`}>
                      Edit
                    </button>
                    <button className="btn-action" aria-label={`Test ${webhook.name}`}>
                      Test
                    </button>
                    <button className="btn-action" aria-label={`Delete ${webhook.name}`}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Webhooks;

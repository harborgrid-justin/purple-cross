import { useState } from 'react';
import { useWebhooks, useCreateWebhook } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Webhooks = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: webhooksData, isLoading, error } = useWebhooks();
  const createWebhook = useCreateWebhook();

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWebhook.mutateAsync({ 
        url: 'https://example.com/webhook',
        events: ['patient.created', 'appointment.scheduled']
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating webhook:', err);
    }
  };



  return (
    <div className="page">
      <header className="page-header">
        <h1>Webhook Management</h1>
        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
          Create Webhook
        </button>
      </header>

      <div className="content-section">
        <p>Event-driven integrations with webhooks.</p>

        {showCreateForm && (
          <div style={{ padding: '1rem', marginTop: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Create New Webhook</h3>
            <form onSubmit={handleCreateWebhook}>
              <button type="submit" className="btn-primary">Create</button>
              <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
            </form>
          </div>
        )}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Webhooks</h3>
            <ul>
              <li>Event subscriptions</li>
              <li>Payload delivery</li>
              <li>Retry logic</li>
              <li>Security</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Events</h3>
            <ul>
              <li>Patient events</li>
              <li>Appointment events</li>
              <li>Billing events</li>
              <li>Custom events</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>Create webhooks</li>
              <li>Test webhooks</li>
              <li>Monitor deliveries</li>
              <li>Debug errors</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>Active Webhooks</h2>
          {isLoading && <p>Loading webhooks...</p>}
          {error && <p style={{ color: 'red' }}>Error loading webhooks</p>}
          {!!webhooksData && (
            <div style={{ marginTop: '1rem' }}>
              <p>Configure and monitor your webhook endpoints.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Webhooks;

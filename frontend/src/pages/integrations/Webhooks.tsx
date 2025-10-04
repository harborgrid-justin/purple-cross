import '../../styles/Page.css';

const Webhooks = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Webhook Management</h1>
      </header>

      <div className="content-section">
        <p>Event-driven integrations with webhooks.</p>
        <div
          className="info-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Webhooks</h3>
            <ul>
              <li>Event subscriptions</li>
              <li>Payload delivery</li>
              <li>Retry logic</li>
              <li>Security</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Events</h3>
            <ul>
              <li>Patient events</li>
              <li>Appointment events</li>
              <li>Billing events</li>
              <li>Custom events</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Management</h3>
            <ul>
              <li>Create webhooks</li>
              <li>Test webhooks</li>
              <li>Monitor deliveries</li>
              <li>Debug errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webhooks;

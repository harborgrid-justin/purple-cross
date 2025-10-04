import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Workflow = () => {
  const { data, isLoading, error } = useAPIQuery('documents');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Document Workflow</h1>
      </header>

      <div className="content-section">
        <p>Automated document routing and approval workflows.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Workflows</h3>
            <ul>
              <li>Approval routing</li>
              <li>Multi-step approvals</li>
              <li>Parallel approvals</li>
              <li>Conditional routing</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Automation</h3>
            <ul>
              <li>Auto-routing</li>
              <li>Email notifications</li>
              <li>Deadline reminders</li>
              <li>Escalations</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Tracking</h3>
            <ul>
              <li>Status tracking</li>
              <li>Audit logs</li>
              <li>Performance metrics</li>
              <li>Bottleneck analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflow;

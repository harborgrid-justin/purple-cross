import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const AccountManagement = () => {
  const { data, isLoading, error } = useAPIQuery('clients');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Account Management</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive client account oversight and management tools.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Account Status</h3>
            <ul>
              <li>Active accounts</li>
              <li>Suspended accounts</li>
              <li>Account history</li>
              <li>Status changes</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Financial Overview</h3>
            <ul>
              <li>Account balance</li>
              <li>Payment history</li>
              <li>Outstanding invoices</li>
              <li>Credit limits</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Account Settings</h3>
            <ul>
              <li>Notification preferences</li>
              <li>Privacy settings</li>
              <li>Two-factor authentication</li>
              <li>Account permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;

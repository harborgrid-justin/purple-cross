import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const SocialMedia = () => {
  const { data, isLoading, error } = useAPIQuery('communications');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Social Media Integration</h1>
      </header>

      <div className="content-section">
        <p>Manage social media presence and engagement.</p>        
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Platforms</h3>
            <ul>
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Twitter</li>
              <li>LinkedIn</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Features</h3>
            <ul>
              <li>Post scheduling</li>
              <li>Review monitoring</li>
              <li>Response management</li>
              <li>Analytics</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Engagement</h3>
            <ul>
              <li>Comment management</li>
              <li>Direct messages</li>
              <li>Reviews</li>
              <li>Reputation management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;

import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Voice = () => {
  const { data, isLoading, error } = useAPIQuery('communications');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Voice Calling Integration</h1>
      </header>

      <div className="content-section">
        <p>Integrated calling system with call tracking.</p>
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading data</p>}
        {!!data && <p style={{ color: 'green', fontSize: '0.9rem' }}>✓ Data loaded from API</p>}

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
            <h3>Features</h3>
            <ul>
              <li>Click-to-call</li>
              <li>Call recording</li>
              <li>Voicemail</li>
              <li>Call routing</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Integration</h3>
            <ul>
              <li>Phone systems</li>
              <li>VoIP</li>
              <li>Mobile apps</li>
              <li>Softphones</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Tracking</h3>
            <ul>
              <li>Call logs</li>
              <li>Call duration</li>
              <li>Call outcomes</li>
              <li>Analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voice;

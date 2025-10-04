import { useThirdPartyIntegrations } from '../../hooks/useAPI';
import '../../styles/Page.css';

const ThirdParty = () => {
  const { data: integrationsData, isLoading, error } = useThirdPartyIntegrations();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Third-Party Integrations</h1>
      </header>

      <div className="content-section">
        <p>Connect with external systems and services.</p>

        {isLoading && <p>Loading integrations...</p>}
        {error && <p style={{ color: 'red' }}>Error loading integrations</p>}
        {!!integrationsData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Manage your third-party service connections.</p>
          </div>
        )}

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
            <h3>Categories</h3>
            <ul>
              <li>Labs</li>
              <li>Pharmacies</li>
              <li>Imaging</li>
              <li>Accounting</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Features</h3>
            <ul>
              <li>Pre-built connectors</li>
              <li>Custom integrations</li>
              <li>Data sync</li>
              <li>Real-time updates</li>
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
              <li>Enable/disable</li>
              <li>Configuration</li>
              <li>Monitoring</li>
              <li>Troubleshooting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdParty;

import { useState } from 'react';
import { useAPIKeys, useCreateAPIKey } from '../../hooks/useAPI';
import '../../styles/Page.css';

const API = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: apiKeysData, isLoading, error } = useAPIKeys();
  const createAPIKey = useCreateAPIKey();

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAPIKey.mutateAsync({ name: 'New API Key' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating API key:', err);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>RESTful API</h1>
        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
          Create API Key
        </button>
      </header>

      <div className="content-section">
        <p>Programmatic access to platform data and functionality.</p>

        {showCreateForm && (
          <div
            style={{
              padding: '1rem',
              marginTop: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Create New API Key</h3>
            <form onSubmit={handleCreateKey}>
              <button type="submit" className="btn-primary">
                Generate Key
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowCreateForm(false)}
                style={{ marginLeft: '0.5rem' }}
              >
                Cancel
              </button>
            </form>
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
            <h3>API Features</h3>
            <ul>
              <li>REST endpoints</li>
              <li>JSON format</li>
              <li>Authentication</li>
              <li>Rate limiting</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Documentation</h3>
            <ul>
              <li>API reference</li>
              <li>Code examples</li>
              <li>SDKs</li>
              <li>Postman collections</li>
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
              <li>API keys</li>
              <li>Usage metrics</li>
              <li>Error logs</li>
              <li>Version control</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>API Keys</h2>
          {isLoading && <p>Loading API keys...</p>}
          {error && <p style={{ color: 'red' }}>Error loading API keys</p>}
          {!!apiKeysData && (
            <div style={{ marginTop: '1rem' }}>
              <p>Manage your API keys for programmatic access to the platform.</p>
              {/* API keys list would be rendered here when data is available */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default API;

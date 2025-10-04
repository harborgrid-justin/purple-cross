import '../../styles/Page.css';

const SSO = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Single Sign-On</h1>
      </header>

      <div className="content-section">
        <p>Enterprise SSO and identity management.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Protocols</h3>
            <ul>
              <li>SAML 2.0</li>
              <li>OAuth 2.0</li>
              <li>OpenID Connect</li>
              <li>LDAP</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Providers</h3>
            <ul>
              <li>Azure AD</li>
              <li>Okta</li>
              <li>Google Workspace</li>
              <li>Custom IdP</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>User provisioning</li>
              <li>Role mapping</li>
              <li>Session management</li>
              <li>Audit logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSO;

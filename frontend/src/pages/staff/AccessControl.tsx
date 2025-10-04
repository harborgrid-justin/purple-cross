import '../../styles/Page.css';

const AccessControl = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Role-Based Access Control</h1>
      </header>

      <div className="content-section">
        <p>Manage user permissions and access levels.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Roles</h3>
            <ul>
              <li>Veterinarian</li>
              <li>Technician</li>
              <li>Receptionist</li>
              <li>Administrator</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Permissions</h3>
            <ul>
              <li>View rights</li>
              <li>Edit rights</li>
              <li>Delete rights</li>
              <li>Module access</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Security</h3>
            <ul>
              <li>Password policies</li>
              <li>Two-factor auth</li>
              <li>Session management</li>
              <li>Audit logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;

import '../../styles/Page.css';

const Communication = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Internal Communication</h1>
      </header>

      <div className="content-section">
        <p>Team communication and collaboration tools.</p>
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
            <h3>Messaging</h3>
            <ul>
              <li>Direct messages</li>
              <li>Team channels</li>
              <li>Announcements</li>
              <li>File sharing</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Meetings</h3>
            <ul>
              <li>Meeting schedules</li>
              <li>Meeting notes</li>
              <li>Action items</li>
              <li>Follow-ups</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Updates</h3>
            <ul>
              <li>News feed</li>
              <li>Policy updates</li>
              <li>Training materials</li>
              <li>Best practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;

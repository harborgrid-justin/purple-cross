import '../../styles/Page.css';

const TimeBlocks = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Time Block Management</h1>
      </header>

      <div className="content-section">
        <p>Manage time blocks for procedures, breaks, and special events.</p>
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
            <h3>Block Types</h3>
            <ul>
              <li>Procedure blocks</li>
              <li>Break blocks</li>
              <li>Meeting blocks</li>
              <li>Emergency blocks</li>
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
              <li>Create blocks</li>
              <li>Recurring blocks</li>
              <li>Block templates</li>
              <li>Quick blocks</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Restrictions</h3>
            <ul>
              <li>Block conflicts</li>
              <li>Override rules</li>
              <li>Priority levels</li>
              <li>Booking restrictions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeBlocks;

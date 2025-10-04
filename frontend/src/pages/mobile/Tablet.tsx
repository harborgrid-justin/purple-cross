import '../../styles/Page.css';

const Tablet = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Tablet Optimization</h1>
      </header>

      <div className="content-section">
        <p>Optimized interface for tablet devices.</p>
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
              <li>Large screen layouts</li>
              <li>Split-screen</li>
              <li>Stylus support</li>
              <li>Keyboard shortcuts</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Use Cases</h3>
            <ul>
              <li>Exam rooms</li>
              <li>Reception desk</li>
              <li>Hospital rounds</li>
              <li>Field service</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Platforms</h3>
            <ul>
              <li>iPad</li>
              <li>Android tablets</li>
              <li>Windows tablets</li>
              <li>Surface devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tablet;

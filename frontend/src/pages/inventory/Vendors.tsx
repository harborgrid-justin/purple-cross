import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Vendors = () => {
  const { data, isLoading, error } = useAPIQuery('inventory');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Vendor Management</h1>
      </header>

      <div className="content-section">
        <p>Manage relationships with suppliers and vendors.</p>
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
            <h3>Vendor Info</h3>
            <ul>
              <li>Contact details</li>
              <li>Product catalogs</li>
              <li>Pricing</li>
              <li>Terms</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Performance</h3>
            <ul>
              <li>Delivery times</li>
              <li>Quality metrics</li>
              <li>Pricing trends</li>
              <li>Reliability scores</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Communication</h3>
            <ul>
              <li>Order tracking</li>
              <li>Issue resolution</li>
              <li>Price negotiations</li>
              <li>Contract management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendors;

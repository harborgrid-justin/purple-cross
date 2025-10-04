import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const Loyalty = () => {
  const { data, isLoading, error } = useAPIQuery('clients');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Loyalty Programs</h1>
      </header>

      <div className="content-section">
        <p>Reward programs and incentives for client retention.</p>
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
            <h3>Rewards Program</h3>
            <ul>
              <li>Points system</li>
              <li>Tier levels</li>
              <li>Reward redemption</li>
              <li>Special offers</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Membership Tiers</h3>
            <ul>
              <li>Bronze level</li>
              <li>Silver level</li>
              <li>Gold level</li>
              <li>Platinum level</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Benefits</h3>
            <ul>
              <li>Discounts</li>
              <li>Priority booking</li>
              <li>Free services</li>
              <li>Exclusive events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;

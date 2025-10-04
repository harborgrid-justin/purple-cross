import { useAPIQuery } from '../../hooks/useAPI';
import '../../styles/Page.css';

const PurchaseOrders = () => {
  const { data, isLoading, error } = useAPIQuery('inventory');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Purchase Order Management</h1>
      </header>

      <div className="content-section">
        <p>Create and track purchase orders.</p>
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
            <h3>PO Creation</h3>
            <ul>
              <li>Quick POs</li>
              <li>Bulk orders</li>
              <li>Standing orders</li>
              <li>Emergency orders</li>
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
              <li>Order status</li>
              <li>Delivery tracking</li>
              <li>Receiving</li>
              <li>Invoice matching</li>
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
              <li>Approve POs</li>
              <li>Cancel orders</li>
              <li>Return items</li>
              <li>Dispute resolution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrders;

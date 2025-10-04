import '../../styles/Page.css';

const PaymentProcessing = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Payment Processing</h1>
      </header>

      <div className="content-section">
        <p>Process payments securely through multiple channels.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Payment Methods</h3>
            <ul>
              <li>Credit cards</li>
              <li>Debit cards</li>
              <li>Cash</li>
              <li>Checks</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Processing</h3>
            <ul>
              <li>Real-time processing</li>
              <li>Batch processing</li>
              <li>Refunds</li>
              <li>Voids</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Security</h3>
            <ul>
              <li>PCI compliance</li>
              <li>Encryption</li>
              <li>Tokenization</li>
              <li>Fraud detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;

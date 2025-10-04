import '../../styles/Page.css';

const InsuranceClaims = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Insurance Claims Management</h1>
      </header>

      <div className="content-section">
        <p>Manage pet insurance claims and reimbursements.</p>
        <div className="info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Claims</h3>
            <ul>
              <li>Submit claims</li>
              <li>Track claims</li>
              <li>Claim status</li>
              <li>Reimbursement</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Integration</h3>
            <ul>
              <li>Insurance partners</li>
              <li>Direct billing</li>
              <li>Claim forms</li>
              <li>Electronic submission</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3>Management</h3>
            <ul>
              <li>Claim tracking</li>
              <li>Denial management</li>
              <li>Appeals</li>
              <li>Documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaims;

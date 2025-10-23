/**
 * WF-COMP-XXX | Accounting.tsx - Accounting
 * Purpose: React component for Accounting functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import '../../styles/Page.css';

const Accounting = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Accounting Software Integration</h1>
      </header>

      <div className="content-section">
        <p>Sync financial data with accounting systems.</p>
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
            <h3>Platforms</h3>
            <ul>
              <li>QuickBooks</li>
              <li>Xero</li>
              <li>Sage</li>
              <li>FreshBooks</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Sync</h3>
            <ul>
              <li>Revenue sync</li>
              <li>Expense sync</li>
              <li>Invoice sync</li>
              <li>Payment sync</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Features</h3>
            <ul>
              <li>Auto-sync</li>
              <li>Manual sync</li>
              <li>Reconciliation</li>
              <li>Error handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounting;

/**
 * WF-COMP-XXX | Sharing.tsx - Sharing
 * Purpose: React component for Sharing functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import '../../styles/Page.css';

const Sharing = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Medical Record Sharing</h1>
      </header>

      <div className="content-section">
        <p>Securely share medical records with other providers.</p>
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
            <h3>Sharing Options</h3>
            <ul>
              <li>Email</li>
              <li>Fax</li>
              <li>Direct share</li>
              <li>Portal access</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Security</h3>
            <ul>
              <li>Encryption</li>
              <li>Access logs</li>
              <li>Expiration dates</li>
              <li>Password protection</li>
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
              <li>Sent records</li>
              <li>Received records</li>
              <li>Access history</li>
              <li>Audit trail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sharing;

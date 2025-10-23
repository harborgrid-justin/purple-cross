/**
 * WF-COMP-XXX | EMR.tsx - E M R
 * Purpose: React component for EMR functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import '../../styles/Page.css';

const EMR = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Electronic Medical Records</h1>
      </header>

      <div className="content-section">
        <p>Comprehensive digital health records system.</p>
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
            <h3>Core Features</h3>
            <ul>
              <li>Digital records</li>
              <li>Quick access</li>
              <li>Secure storage</li>
              <li>Version control</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Templates</h3>
            <ul>
              <li>SOAP notes</li>
              <li>Progress notes</li>
              <li>Discharge summaries</li>
              <li>Referral letters</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Integration</h3>
            <ul>
              <li>Lab results</li>
              <li>Imaging</li>
              <li>Prescriptions</li>
              <li>Invoices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMR;

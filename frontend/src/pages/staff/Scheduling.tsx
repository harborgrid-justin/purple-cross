/**
 * WF-COMP-XXX | Scheduling.tsx - Scheduling
 * Purpose: React component for Scheduling functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import '../../styles/Page.css';

const Scheduling = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Shift Scheduling</h1>
      </header>

      <div className="content-section">
        <p>Create and manage employee work schedules.</p>
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
            <h3>Scheduling</h3>
            <ul>
              <li>Shift creation</li>
              <li>Shift templates</li>
              <li>Recurring shifts</li>
              <li>Shift swaps</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Coverage</h3>
            <ul>
              <li>Availability</li>
              <li>Time-off requests</li>
              <li>Coverage gaps</li>
              <li>On-call schedules</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Notifications</h3>
            <ul>
              <li>Schedule changes</li>
              <li>Shift reminders</li>
              <li>Coverage alerts</li>
              <li>Overtime alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;

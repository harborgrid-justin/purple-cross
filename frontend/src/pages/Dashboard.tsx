import '../styles/Page.css';

const Dashboard = () => {
  const stats = [
    { label: 'Total Patients', value: '1,234', change: '+12%', icon: '🐕' },
    { label: 'Today\'s Appointments', value: '24', change: '+5%', icon: '📅' },
    { label: 'Active Prescriptions', value: '567', change: '-2%', icon: '💊' },
    { label: 'Revenue (MTD)', value: '$45,678', change: '+18%', icon: '💰' },
  ];

  const recentActivities = [
    { time: '10:30 AM', activity: 'Appointment with Max (Labrador)', type: 'appointment' },
    { time: '11:15 AM', activity: 'New patient registered: Bella', type: 'registration' },
    { time: '12:00 PM', activity: 'Lab results received for Charlie', type: 'lab' },
    { time: '02:45 PM', activity: 'Prescription refill: Luna', type: 'prescription' },
    { time: '03:30 PM', activity: 'Payment received: $250', type: 'payment' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-text">{activity.activity}</span>
                <span className={`activity-badge ${activity.type}`}>{activity.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-button">📅 New Appointment</button>
            <button className="action-button">🐕 Register Patient</button>
            <button className="action-button">💊 Create Prescription</button>
            <button className="action-button">📋 Add Medical Record</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Patients', value: '1,234', change: '+12%', icon: '🐾' },
    { label: 'Appointments Today', value: '28', change: '+5%', icon: '📅' },
    { label: 'Revenue (Month)', value: '$45,678', change: '+18%', icon: '💰' },
    { label: 'Active Staff', value: '15', change: '0%', icon: '👨‍⚕️' },
  ];

  const recentActivities = [
    { type: 'appointment', message: 'New appointment scheduled for Max (Dog)', time: '5 min ago' },
    { type: 'payment', message: 'Payment received from Sarah Johnson', time: '15 min ago' },
    { type: 'lab', message: 'Lab results ready for Luna (Cat)', time: '30 min ago' },
    { type: 'inventory', message: 'Low stock alert: Vaccines', time: '1 hour ago' },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-change">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {recentActivities.map((activity, index) => (
              <li key={index} className="activity-item">
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">New Appointment</button>
            <button className="action-btn">Register Patient</button>
            <button className="action-btn">Create Invoice</button>
            <button className="action-btn">View Schedule</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

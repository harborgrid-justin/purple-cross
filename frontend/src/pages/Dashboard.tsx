import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Page.css';

interface DashboardStats {
  totalPatients: number;
  totalClients: number;
  totalAppointments: number;
  activePatients: number;
  todayAppointments: number;
  pendingInvoices: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await api.analytics.getDashboard() as { status: string; data: DashboardStats };
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data. Using demo data.');
        // Fallback to demo data
        setStats({
          totalPatients: 1234,
          totalClients: 856,
          totalAppointments: 3456,
          activePatients: 1180,
          todayAppointments: 24,
          pendingInvoices: 45,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const recentActivities = [
    { time: '10:30 AM', activity: 'Appointment with Max (Labrador)', type: 'appointment' },
    { time: '11:15 AM', activity: 'New patient registered: Bella', type: 'registration' },
    { time: '12:00 PM', activity: 'Lab results received for Charlie', type: 'lab' },
    { time: '02:45 PM', activity: 'Prescription refill: Luna', type: 'prescription' },
    { time: '03:30 PM', activity: 'Payment received: $250', type: 'payment' },
  ];

  const displayStats = stats
    ? [
        { label: 'Total Patients', value: stats.totalPatients.toLocaleString(), icon: '🐕' },
        { label: "Today's Appointments", value: stats.todayAppointments.toString(), icon: '📅' },
        { label: 'Active Patients', value: stats.activePatients.toLocaleString(), icon: '✅' },
        { label: 'Pending Invoices', value: stats.pendingInvoices.toString(), icon: '💰' },
      ]
    : [];

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p className="page-subtitle">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="stats-grid">
        {displayStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
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

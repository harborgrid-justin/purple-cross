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
        const response = (await api.analytics.getDashboard()) as {
          status: string;
          data: DashboardStats;
        };
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
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here&apos;s what&apos;s happening today.</p>
        {error && (
          <div role="alert" className="error-message">
            {error}
          </div>
        )}
      </header>

      <section aria-label="Dashboard statistics" className="stats-grid">
        {displayStats.map((stat) => (
          <article
            key={stat.label}
            className="stat-card"
            role="region"
            aria-label={`${stat.label}: ${stat.value}`}
          >
            <div className="stat-icon" aria-hidden="true">
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" aria-live="polite">
                {stat.value}
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="dashboard-content">
        <section className="activity-section" aria-labelledby="recent-activity-heading">
          <h2 id="recent-activity-heading">Recent Activity</h2>
          <ul className="activity-list" role="list">
            {recentActivities.map((activity, index) => (
              <li key={index} className="activity-item">
                <time className="activity-time">{activity.time}</time>
                <span className="activity-text">{activity.activity}</span>
                <span
                  className={`activity-badge ${activity.type}`}
                  aria-label={`Type: ${activity.type}`}
                >
                  {activity.type}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="quick-actions-section" aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading">Quick Actions</h2>
          <nav className="quick-actions" aria-label="Quick action buttons">
            <button className="action-button" aria-label="Schedule a new appointment">
              <span aria-hidden="true">📅</span> New Appointment
            </button>
            <button className="action-button" aria-label="Register a new patient">
              <span aria-hidden="true">🐕</span> Register Patient
            </button>
            <button className="action-button" aria-label="Create a new prescription">
              <span aria-hidden="true">💊</span> Create Prescription
            </button>
            <button className="action-button" aria-label="Add a new medical record">
              <span aria-hidden="true">📋</span> Add Medical Record
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

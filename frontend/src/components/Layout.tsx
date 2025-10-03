import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Patients', path: '/patients', icon: '🐕' },
    { name: 'Clients', path: '/clients', icon: '👥' },
    { name: 'Appointments', path: '/appointments', icon: '📅' },
    { name: 'Medical Records', path: '/medical-records', icon: '📋' },
    { name: 'Prescriptions', path: '/prescriptions', icon: '💊' },
    { name: 'Inventory', path: '/inventory', icon: '📦' },
    { name: 'Billing', path: '/billing', icon: '💰' },
    { name: 'Laboratory', path: '/laboratory', icon: '🔬' },
    { name: 'Staff', path: '/staff', icon: '👨‍⚕️' },
    { name: 'Reports', path: '/reports', icon: '📈' },
    { name: 'Communications', path: '/communications', icon: '✉️' },
    { name: 'Documents', path: '/documents', icon: '📄' },
    { name: 'Compliance', path: '/compliance', icon: '✓' },
    { name: 'Integrations', path: '/integrations', icon: '🔗' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1 className="app-title">🟣 Purple Cross</h1>
        </div>
        <div className="header-right">
          <span className="user-info">Dr. Smith</span>
        </div>
      </header>

      <div className="main-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="nav-label">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

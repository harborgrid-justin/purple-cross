/**
 * WF-COMP-XXX | Layout.tsx - Layout
 * Purpose: React component for Layout functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

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
    { name: 'Mobile', path: '/mobile', icon: '📱' },
  ];

  return (
    <div className="layout">
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="header" role="banner">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar navigation' : 'Open sidebar navigation'}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-nav"
          >
            ☰
          </button>
          <h1 className="app-title">🟣 Purple Cross</h1>
        </div>
        <div className="header-right">
          <span className="user-info" aria-label="Current user: Dr. Smith">
            Dr. Smith
          </span>
        </div>
      </header>

      <div className="main-container">
        <aside
          id="sidebar-nav"
          className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
          aria-hidden={!sidebarOpen}
          role="navigation"
          aria-label="Main navigation"
        >
          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
                aria-label={item.name}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {sidebarOpen && <span className="nav-label">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        <main id="main-content" className="content" role="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

interface NavigationProps {
  isOpen: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/patients', label: 'Patient Management', icon: '🐾' },
    { path: '/clients', label: 'Client Management', icon: '👥' },
    { path: '/appointments', label: 'Appointments', icon: '📅' },
    { path: '/medical-records', label: 'Medical Records', icon: '📋' },
    { path: '/prescriptions', label: 'Prescriptions', icon: '💊' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/billing', label: 'Billing & Payments', icon: '💳' },
    { path: '/laboratory', label: 'Laboratory', icon: '🔬' },
    { path: '/staff', label: 'Staff Management', icon: '👨‍⚕️' },
    { path: '/reports', label: 'Reports & Analytics', icon: '📈' },
    { path: '/communications', label: 'Communications', icon: '📧' },
    { path: '/documents', label: 'Documents', icon: '📄' },
    { path: '/compliance', label: 'Compliance', icon: '✅' },
    { path: '/integrations', label: 'Integrations', icon: '🔗' },
    { path: '/mobile', label: 'Mobile Access', icon: '📱' },
  ];

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <NavLink 
              to={item.path} 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <span className="nav-icon">{item.icon}</span>
              {isOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;

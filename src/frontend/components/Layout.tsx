import React, { useState } from 'react';
import Navigation from './Navigation';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <h1 className="app-title">Purple Cross</h1>
        </div>
        <div className="header-right">
          <span className="user-info">Admin User</span>
        </div>
      </header>
      
      <div className="main-container">
        <Navigation isOpen={sidebarOpen} />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

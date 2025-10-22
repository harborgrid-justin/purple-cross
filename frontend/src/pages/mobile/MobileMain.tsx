/**
 * WF-COMP-MOBILE-007 | MobileMain.tsx - Main mobile page
 * Purpose: Main mobile list and navigation page
 * Related: MobileList component, mobile routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import '../../styles/Page.css';

// Lazy load subfeature pages
const Applications = lazy(() => import('./Applications'));
const Tablet = lazy(() => import('./Tablet'));
const RemoteDesktop = lazy(() => import('./RemoteDesktop'));
const FieldService = lazy(() => import('./FieldService'));
const EmergencyAccess = lazy(() => import('./EmergencyAccess'));
const Offline = lazy(() => import('./Offline'));
const MobileReporting = lazy(() => import('./MobileReporting'));
const Sync = lazy(() => import('./Sync'));

const MobileList = () => {
  const [devices] = useState([
    {
      id: '1',
      device: 'iPhone 13 - Dr. Smith',
      platform: 'iOS',
      version: '1.2.0',
      lastSync: '2024-01-15',
      status: 'Active',
    },
    {
      id: '2',
      device: 'iPad Pro - Reception',
      platform: 'iOS',
      version: '1.2.0',
      lastSync: '2024-01-16',
      status: 'Active',
    },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Mobile devices list">
        <thead>
          <tr>
            <th scope="col">Device</th>
            <th scope="col">Platform</th>
            <th scope="col">Version</th>
            <th scope="col">Last Sync</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <th scope="row">{device.device}</th>
              <td>{device.platform}</td>
              <td>{device.version}</td>
              <td>{device.lastSync}</td>
              <td>
                <span className="status-badge status-confirmed">{device.status}</span>
              </td>
              <td>
                <button className="btn-action" aria-label={`Manage ${device.device}`}>
                  Manage
                </button>
                <button className="btn-action" aria-label={`Revoke access for ${device.device}`}>
                  Revoke
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MobileMain = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📱</span> Mobile & Remote Access
        </h1>
        <button className="btn-primary" aria-label="Register new device">
          + Register Device
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Mobile sections">
        <Link
          to="/mobile"
          className={`sub-nav-link ${location.pathname === '/mobile' ? 'active' : ''}`}
        >
          Devices
        </Link>
        <Link
          to="/mobile/applications"
          className={`sub-nav-link ${location.pathname.includes('/applications') ? 'active' : ''}`}
        >
          Mobile Applications
        </Link>
        <Link
          to="/mobile/tablet"
          className={`sub-nav-link ${location.pathname.includes('/tablet') ? 'active' : ''}`}
        >
          Tablet Optimization
        </Link>
        <Link
          to="/mobile/remote-desktop"
          className={`sub-nav-link ${location.pathname.includes('/remote-desktop') ? 'active' : ''}`}
        >
          Remote Desktop
        </Link>
        <Link
          to="/mobile/field-service"
          className={`sub-nav-link ${location.pathname.includes('/field-service') ? 'active' : ''}`}
        >
          Field Service
        </Link>
        <Link
          to="/mobile/emergency-access"
          className={`sub-nav-link ${location.pathname.includes('/emergency-access') ? 'active' : ''}`}
        >
          Emergency Access
        </Link>
        <Link
          to="/mobile/offline"
          className={`sub-nav-link ${location.pathname.includes('/offline') ? 'active' : ''}`}
        >
          Offline Capabilities
        </Link>
        <Link
          to="/mobile/reporting"
          className={`sub-nav-link ${location.pathname.includes('/reporting') ? 'active' : ''}`}
        >
          Mobile Reporting
        </Link>
        <Link
          to="/mobile/sync"
          className={`sub-nav-link ${location.pathname.includes('/sync') ? 'active' : ''}`}
        >
          Cross-Platform Sync
        </Link>
      </nav>

      <Suspense
        fallback={
          <div role="status">
            <p>Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<MobileList />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/tablet" element={<Tablet />} />
          <Route path="/remote-desktop" element={<RemoteDesktop />} />
          <Route path="/field-service" element={<FieldService />} />
          <Route path="/emergency-access" element={<EmergencyAccess />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="/reporting" element={<MobileReporting />} />
          <Route path="/sync" element={<Sync />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default MobileMain;

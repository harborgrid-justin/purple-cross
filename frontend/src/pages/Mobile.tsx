import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Mobile = () => {
  const [devices] = useState([
    { id: '1', device: 'iPhone 13 - Dr. Smith', platform: 'iOS', version: '1.2.0', lastSync: '2024-01-15', status: 'Active' },
    { id: '2', device: 'iPad Pro - Reception', platform: 'iOS', version: '1.2.0', lastSync: '2024-01-16', status: 'Active' },
  ]);

  return (
    <div className="page">
      <header className="page-header">
        <h1><span aria-hidden="true">📱</span> Mobile & Remote Access</h1>
        <button className="btn-primary" aria-label="Register new device">
          + Register Device
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Mobile sections">
        <Link to="/mobile" className="sub-nav-link active">Devices</Link>
        <Link to="/mobile/applications" className="sub-nav-link">Mobile Applications</Link>
        <Link to="/mobile/tablet" className="sub-nav-link">Tablet Optimization</Link>
        <Link to="/mobile/remote-desktop" className="sub-nav-link">Remote Desktop</Link>
        <Link to="/mobile/field-service" className="sub-nav-link">Field Service</Link>
        <Link to="/mobile/emergency-access" className="sub-nav-link">Emergency Access</Link>
        <Link to="/mobile/offline" className="sub-nav-link">Offline Capabilities</Link>
        <Link to="/mobile/reporting" className="sub-nav-link">Mobile Reporting</Link>
        <Link to="/mobile/sync" className="sub-nav-link">Cross-Platform Sync</Link>
      </nav>

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
                  <span className="status-badge status-confirmed">
                    {device.status}
                  </span>
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
    </div>
  );
};

export default Mobile;

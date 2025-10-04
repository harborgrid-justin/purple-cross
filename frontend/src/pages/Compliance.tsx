import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Compliance = () => {
  const [items] = useState([
    {
      id: '1',
      type: 'License',
      name: 'Dr. Smith DEA License',
      expiry: '2024-12-31',
      status: 'Active',
    },
    {
      id: '2',
      type: 'Audit',
      name: 'HIPAA Compliance Audit',
      date: '2024-01-15',
      status: 'Completed',
    },
  ]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✓</span> Compliance & Regulatory
        </h1>
        <button className="btn-primary" aria-label="Add compliance item">
          + Add Item
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Compliance sections">
        <Link to="/compliance" className="sub-nav-link active">
          Overview
        </Link>
        <Link to="/compliance/hipaa" className="sub-nav-link">
          HIPAA Compliance
        </Link>
        <Link to="/compliance/licenses" className="sub-nav-link">
          License Tracking
        </Link>
        <Link to="/compliance/controlled-substances" className="sub-nav-link">
          Controlled Substances
        </Link>
        <Link to="/compliance/record-retention" className="sub-nav-link">
          Record Retention
        </Link>
        <Link to="/compliance/incident-reporting" className="sub-nav-link">
          Incident Reporting
        </Link>
        <Link to="/compliance/policies" className="sub-nav-link">
          Policy Management
        </Link>
        <Link to="/compliance/audit-prep" className="sub-nav-link">
          Audit Preparation
        </Link>
        <Link to="/compliance/updates" className="sub-nav-link">
          Regulatory Updates
        </Link>
      </nav>

      <div className="table-container">
        <table className="data-table" role="table" aria-label="Compliance items list">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Name</th>
              <th scope="col">Date/Expiry</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.type}</td>
                <th scope="row">{item.name}</th>
                <td>{item.expiry || item.date}</td>
                <td>
                  <span
                    className={`status-badge status-${item.status === 'Active' || item.status === 'Completed' ? 'confirmed' : 'pending'}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <button className="btn-action" aria-label={`View ${item.name}`}>
                    View
                  </button>
                  <button className="btn-action" aria-label={`Manage ${item.name}`}>
                    Manage
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

export default Compliance;

import { useState, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import '../styles/Page.css';

// Lazy load subfeature pages
const ClientPortal = lazy(() => import('./communications/ClientPortal'));
const SMS = lazy(() => import('./communications/SMS'));
const Email = lazy(() => import('./communications/Email'));
const Voice = lazy(() => import('./communications/Voice'));
const Telemedicine = lazy(() => import('./communications/Telemedicine'));
const Notifications = lazy(() => import('./communications/Notifications'));
const SocialMedia = lazy(() => import('./communications/SocialMedia'));
const Marketing = lazy(() => import('./communications/Marketing'));

const CommunicationsList = () => {
  const [messages] = useState([
    {
      id: '1',
      recipient: 'John Smith',
      type: 'SMS',
      subject: 'Appointment Reminder',
      date: '2024-01-15',
      status: 'Sent',
    },
    {
      id: '2',
      recipient: 'Sarah Johnson',
      type: 'Email',
      subject: 'Lab Results',
      date: '2024-01-14',
      status: 'Delivered',
    },
  ]);

  return (
    <div className="table-container">
      <table className="data-table" role="table" aria-label="Messages list">
        <thead>
          <tr>
            <th scope="col">Recipient</th>
            <th scope="col">Type</th>
            <th scope="col">Subject</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <th scope="row">{message.recipient}</th>
              <td>{message.type}</td>
              <td>{message.subject}</td>
              <td>{message.date}</td>
              <td>
                <span className="status-badge status-confirmed">{message.status}</span>
              </td>
              <td>
                <button className="btn-action" aria-label={`View message to ${message.recipient}`}>
                  View
                </button>
                <button
                  className="btn-action"
                  aria-label={`Resend message to ${message.recipient}`}
                >
                  Resend
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Communications = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✉️</span> Communications
        </h1>
        <button className="btn-primary" aria-label="Send new message">
          + New Message
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Communications sections">
        <Link
          to="/communications"
          className={`sub-nav-link ${location.pathname === '/communications' ? 'active' : ''}`}
        >
          All Messages
        </Link>
        <Link
          to="/communications/client-portal"
          className={`sub-nav-link ${location.pathname.includes('/client-portal') ? 'active' : ''}`}
        >
          Client Portal
        </Link>
        <Link
          to="/communications/sms"
          className={`sub-nav-link ${location.pathname.includes('/sms') ? 'active' : ''}`}
        >
          SMS Messaging
        </Link>
        <Link
          to="/communications/email"
          className={`sub-nav-link ${location.pathname.includes('/email') ? 'active' : ''}`}
        >
          Email Communication
        </Link>
        <Link
          to="/communications/voice"
          className={`sub-nav-link ${location.pathname.includes('/voice') ? 'active' : ''}`}
        >
          Voice Calling
        </Link>
        <Link
          to="/communications/telemedicine"
          className={`sub-nav-link ${location.pathname.includes('/telemedicine') ? 'active' : ''}`}
        >
          Video Telemedicine
        </Link>
        <Link
          to="/communications/notifications"
          className={`sub-nav-link ${location.pathname.includes('/notifications') ? 'active' : ''}`}
        >
          Push Notifications
        </Link>
        <Link
          to="/communications/social-media"
          className={`sub-nav-link ${location.pathname.includes('/social-media') ? 'active' : ''}`}
        >
          Social Media
        </Link>
        <Link
          to="/communications/marketing"
          className={`sub-nav-link ${location.pathname.includes('/marketing') ? 'active' : ''}`}
        >
          Marketing Automation
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
          <Route path="/" element={<CommunicationsList />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/sms" element={<SMS />} />
          <Route path="/email" element={<Email />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/social-media" element={<SocialMedia />} />
          <Route path="/marketing" element={<Marketing />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Communications;

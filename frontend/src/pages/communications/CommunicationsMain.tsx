/**
 * WF-COMP-COMMUNICATIONS-007 | CommunicationsMain.tsx - Main communications page
 * Purpose: Main communications list and navigation page
 * Related: CommunicationsList component, communications routes
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import { Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useCommunications } from '../../hooks/useCommunications';
import '../../styles/Page.css';

// Lazy load subfeature pages
const ClientPortal = lazy(() => import('./ClientPortal'));
const SMS = lazy(() => import('./SMS'));
const Email = lazy(() => import('./Email'));
const Voice = lazy(() => import('./Voice'));
const Telemedicine = lazy(() => import('./Telemedicine'));
const Notifications = lazy(() => import('./Notifications'));
const SocialMedia = lazy(() => import('./SocialMedia'));
const Marketing = lazy(() => import('./Marketing'));

interface MessageRow {
  id: string;
  type: string;
  subject?: string;
  message: string;
  status: string;
  sentAt?: string;
  client?: { firstName?: string; lastName?: string };
}

const CommunicationsList = () => {
  const { data, isLoading, isError } = useCommunications({ limit: 50 });

  const messages = (data as { data?: MessageRow[] } | undefined)?.data ?? [];

  return (
    <div className="table-container">
      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading messages...</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load messages. Please try again.</p>
        </div>
      ) : messages.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No messages found. Create one to get started.</p>
        </div>
      ) : (
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
            {messages.map((message) => {
              const recipient = message.client
                ? `${message.client.firstName ?? ''} ${message.client.lastName ?? ''}`.trim()
                : 'Unknown';
              return (
                <tr key={message.id}>
                  <th scope="row">{recipient || 'Unknown'}</th>
                  <td>{message.type}</td>
                  <td>{message.subject || 'N/A'}</td>
                  <td>
                    {message.sentAt ? (
                      <time dateTime={message.sentAt}>
                        {new Date(message.sentAt).toLocaleDateString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <span className="status-badge status-confirmed">{message.status}</span>
                  </td>
                  <td>
                    <Link
                      to={`/communications/${message.id}`}
                      className="btn-action"
                      aria-label={`View message ${message.subject || message.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const CommunicationsMain = () => {
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

export default CommunicationsMain;

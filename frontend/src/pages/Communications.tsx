/**
 * WF-COMP-XXX | Communications.tsx - Communications
 * Purpose: React component for Communications functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useCommunications } from '../hooks/useCommunications';
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
const CommunicationsCreate = lazy(() => import('./communications/CommunicationsCreate'));
const CommunicationsDetail = lazy(() => import('./communications/CommunicationsDetail'));
const CommunicationsEdit = lazy(() => import('./communications/CommunicationsEdit'));

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

const Communications = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">✉️</span> Communications
        </h1>
        <Link to="/communications/create" className="btn-primary" aria-label="Send new message">
          + New Message
        </Link>
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
          <Route path="/create" element={<CommunicationsCreate />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/sms" element={<SMS />} />
          <Route path="/email" element={<Email />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/social-media" element={<SocialMedia />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/:id/edit" element={<CommunicationsEdit />} />
          <Route path="/:id" element={<CommunicationsDetail />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Communications;

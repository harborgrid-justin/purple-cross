import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Page.css';

const Communications = () => {
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
        <Link to="/communications" className="sub-nav-link active">
          All Messages
        </Link>
        <Link to="/communications/client-portal" className="sub-nav-link">
          Client Portal
        </Link>
        <Link to="/communications/sms" className="sub-nav-link">
          SMS Messaging
        </Link>
        <Link to="/communications/email" className="sub-nav-link">
          Email Communication
        </Link>
        <Link to="/communications/voice" className="sub-nav-link">
          Voice Calling
        </Link>
        <Link to="/communications/telemedicine" className="sub-nav-link">
          Video Telemedicine
        </Link>
        <Link to="/communications/notifications" className="sub-nav-link">
          Push Notifications
        </Link>
        <Link to="/communications/social-media" className="sub-nav-link">
          Social Media
        </Link>
        <Link to="/communications/marketing" className="sub-nav-link">
          Marketing Automation
        </Link>
      </nav>

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
                  <button
                    className="btn-action"
                    aria-label={`View message to ${message.recipient}`}
                  >
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
    </div>
  );
};

export default Communications;

import { useState, useEffect, Suspense, lazy } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/Page.css';

// Lazy load subfeature pages
const Registration = lazy(() => import('./clients/Registration'));
const AccountManagement = lazy(() => import('./clients/AccountManagement'));
const MultiPet = lazy(() => import('./clients/MultiPet'));
const CommunicationHistory = lazy(() => import('./clients/CommunicationHistory'));
const PortalAccess = lazy(() => import('./clients/PortalAccess'));
const Loyalty = lazy(() => import('./clients/Loyalty'));
const Feedback = lazy(() => import('./clients/Feedback'));
const Segmentation = lazy(() => import('./clients/Segmentation'));

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  patients?: Array<{ id: string; name: string; species: string }>;
}

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = (await api.clients.getAll({
          search: searchTerm || undefined,
          limit: 50,
        })) as { status: string; data: Client[] };
        setClients(response.data);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchClients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👥</span> Clients
        </h1>
        <button className="btn-primary" aria-label="Add a new client">
          + Add New Client
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Client sections">
        <Link to="/clients" className="sub-nav-link active">
          All Clients
        </Link>
        <Link to="/clients/registration" className="sub-nav-link">
          Registration & Profiles
        </Link>
        <Link to="/clients/account-management" className="sub-nav-link">
          Account Management
        </Link>
        <Link to="/clients/multi-pet" className="sub-nav-link">
          Multi-Pet Households
        </Link>
        <Link to="/clients/communication-history" className="sub-nav-link">
          Communication History
        </Link>
        <Link to="/clients/portal-access" className="sub-nav-link">
          Portal Access
        </Link>
        <Link to="/clients/loyalty" className="sub-nav-link">
          Loyalty Programs
        </Link>
        <Link to="/clients/feedback" className="sub-nav-link">
          Feedback & Surveys
        </Link>
        <Link to="/clients/segmentation" className="sub-nav-link">
          Client Segmentation
        </Link>
      </nav>

      <div className="search-bar" role="search">
        <label htmlFor="client-search" className="sr-only">
          Search clients
        </label>
        <input
          id="client-search"
          type="search"
          placeholder="Search clients by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search clients by name, email, or phone"
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div role="status" aria-live="polite">
            <p>Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No clients found. Add a new client to get started.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Clients list">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Location</th>
                <th scope="col">Pets</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <th scope="row">
                    {client.firstName} {client.lastName}
                  </th>
                  <td>
                    <a
                      href={`mailto:${client.email}`}
                      aria-label={`Email ${client.firstName} ${client.lastName}`}
                    >
                      {client.email}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`tel:${client.phone}`}
                      aria-label={`Call ${client.firstName} ${client.lastName}`}
                    >
                      {client.phone}
                    </a>
                  </td>
                  <td>
                    {client.city}, {client.state}
                  </td>
                  <td>{client.patients?.length || 0}</td>
                  <td>
                    <button
                      className="btn-action"
                      aria-label={`View details for ${client.firstName} ${client.lastName}`}
                    >
                      View
                    </button>
                    <button
                      className="btn-action"
                      aria-label={`Edit information for ${client.firstName} ${client.lastName}`}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const Clients = () => {
  const location = useLocation();

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👥</span> Clients
        </h1>
        <button className="btn-primary" aria-label="Add a new client">
          + Add New Client
        </button>
      </header>

      <nav className="sub-nav" role="navigation" aria-label="Client sections">
        <Link
          to="/clients"
          className={`sub-nav-link ${location.pathname === '/clients' ? 'active' : ''}`}
        >
          All Clients
        </Link>
        <Link
          to="/clients/registration"
          className={`sub-nav-link ${location.pathname.includes('/registration') ? 'active' : ''}`}
        >
          Registration & Profiles
        </Link>
        <Link
          to="/clients/account-management"
          className={`sub-nav-link ${location.pathname.includes('/account-management') ? 'active' : ''}`}
        >
          Account Management
        </Link>
        <Link
          to="/clients/multi-pet"
          className={`sub-nav-link ${location.pathname.includes('/multi-pet') ? 'active' : ''}`}
        >
          Multi-Pet Households
        </Link>
        <Link
          to="/clients/communication-history"
          className={`sub-nav-link ${location.pathname.includes('/communication-history') ? 'active' : ''}`}
        >
          Communication History
        </Link>
        <Link
          to="/clients/portal-access"
          className={`sub-nav-link ${location.pathname.includes('/portal-access') ? 'active' : ''}`}
        >
          Portal Access
        </Link>
        <Link
          to="/clients/loyalty"
          className={`sub-nav-link ${location.pathname.includes('/loyalty') ? 'active' : ''}`}
        >
          Loyalty Programs
        </Link>
        <Link
          to="/clients/feedback"
          className={`sub-nav-link ${location.pathname.includes('/feedback') ? 'active' : ''}`}
        >
          Feedback & Surveys
        </Link>
        <Link
          to="/clients/segmentation"
          className={`sub-nav-link ${location.pathname.includes('/segmentation') ? 'active' : ''}`}
        >
          Client Segmentation
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
          <Route path="/" element={<ClientsList />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/multi-pet" element={<MultiPet />} />
          <Route path="/communication-history" element={<CommunicationHistory />} />
          <Route path="/portal-access" element={<PortalAccess />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/segmentation" element={<Segmentation />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Clients;

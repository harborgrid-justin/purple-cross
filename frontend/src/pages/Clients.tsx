import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Page.css';

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

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response: { status: string; data: Client[] } = await api.clients.getAll({
          search: searchTerm || undefined,
          limit: 50,
        });
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
      <div className="page-header">
        <h1>👥 Clients</h1>
        <button className="btn-primary">+ Add New Client</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search clients by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading clients...</p>
        ) : clients.length === 0 ? (
          <p>No clients found. Add a new client to get started.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Pets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    {client.firstName} {client.lastName}
                  </td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>
                    {client.city}, {client.state}
                  </td>
                  <td>{client.patients?.length || 0}</td>
                  <td>
                    <button className="btn-action">View</button>
                    <button className="btn-action">Edit</button>
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

export default Clients;

import { useFieldService } from '../../hooks/useAPI';
import '../../styles/Page.css';

const FieldService = () => {
  const { data: fieldServiceData, isLoading, error } = useFieldService();

  return (
    <div className="page">
      <header className="page-header">
        <h1>Field Service Management</h1>
      </header>

      <div className="content-section">
        <p>Mobile tools for on-site veterinary services.</p>

        {isLoading && <p>Loading field service data...</p>}
        {error && <p style={{ color: 'red' }}>Error loading field service data</p>}
        {!!fieldServiceData && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Field service data loaded successfully.</p>
          </div>
        )}

        <div
          className="info-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Features</h3>
            <ul>
              <li>GPS tracking</li>
              <li>Route optimization</li>
              <li>Offline data</li>
              <li>Mobile forms</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Services</h3>
            <ul>
              <li>Farm calls</li>
              <li>Emergency visits</li>
              <li>Mobile surgery</li>
              <li>Vaccinations</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h3>Management</h3>
            <ul>
              <li>Scheduling</li>
              <li>Dispatch</li>
              <li>Time tracking</li>
              <li>Invoicing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldService;

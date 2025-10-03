import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load pages for better performance and code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Clients = lazy(() => import('./pages/Clients'));
const Appointments = lazy(() => import('./pages/Appointments'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component with proper accessibility
const LoadingFallback = () => (
  <div 
    className="loading-container" 
    role="status" 
    aria-live="polite" 
    aria-label="Loading content"
  >
    <div className="loading-spinner" aria-hidden="true"></div>
    <p className="loading-text">Loading...</p>
  </div>
);

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;

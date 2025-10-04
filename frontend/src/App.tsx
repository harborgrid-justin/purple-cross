import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load pages for better performance and code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Clients = lazy(() => import('./pages/Clients'));
const Appointments = lazy(() => import('./pages/Appointments'));
const MedicalRecords = lazy(() => import('./pages/MedicalRecords'));
const Prescriptions = lazy(() => import('./pages/Prescriptions'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Billing = lazy(() => import('./pages/Billing'));
const Laboratory = lazy(() => import('./pages/Laboratory'));
const Staff = lazy(() => import('./pages/Staff'));
const Reports = lazy(() => import('./pages/Reports'));
const Communications = lazy(() => import('./pages/Communications'));
const Documents = lazy(() => import('./pages/Documents'));
const Compliance = lazy(() => import('./pages/Compliance'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Mobile = lazy(() => import('./pages/Mobile'));
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
          <Route path="/patients/*" element={<Patients />} />
          <Route path="/clients/*" element={<Clients />} />
          <Route path="/appointments/*" element={<Appointments />} />
          <Route path="/medical-records/*" element={<MedicalRecords />} />
          <Route path="/prescriptions/*" element={<Prescriptions />} />
          <Route path="/inventory/*" element={<Inventory />} />
          <Route path="/billing/*" element={<Billing />} />
          <Route path="/laboratory/*" element={<Laboratory />} />
          <Route path="/staff/*" element={<Staff />} />
          <Route path="/reports/*" element={<Reports />} />
          <Route path="/communications/*" element={<Communications />} />
          <Route path="/documents/*" element={<Documents />} />
          <Route path="/compliance/*" element={<Compliance />} />
          <Route path="/integrations/*" element={<Integrations />} />
          <Route path="/mobile/*" element={<Mobile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;

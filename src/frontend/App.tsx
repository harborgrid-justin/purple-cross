import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientManagement from './modules/PatientManagement';
import ClientManagement from './modules/ClientManagement';
import AppointmentScheduling from './modules/AppointmentScheduling';
import MedicalRecords from './modules/MedicalRecords';
import PrescriptionManagement from './modules/PrescriptionManagement';
import InventoryManagement from './modules/InventoryManagement';
import BillingPayment from './modules/BillingPayment';
import LaboratoryManagement from './modules/LaboratoryManagement';
import StaffManagement from './modules/StaffManagement';
import ReportingAnalytics from './modules/ReportingAnalytics';
import CommunicationMessaging from './modules/CommunicationMessaging';
import DocumentManagement from './modules/DocumentManagement';
import ComplianceRegulatory from './modules/ComplianceRegulatory';
import IntegrationAPI from './modules/IntegrationAPI';
import MobileRemoteAccess from './modules/MobileRemoteAccess';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients/*" element={<PatientManagement />} />
          <Route path="/clients/*" element={<ClientManagement />} />
          <Route path="/appointments/*" element={<AppointmentScheduling />} />
          <Route path="/medical-records/*" element={<MedicalRecords />} />
          <Route path="/prescriptions/*" element={<PrescriptionManagement />} />
          <Route path="/inventory/*" element={<InventoryManagement />} />
          <Route path="/billing/*" element={<BillingPayment />} />
          <Route path="/laboratory/*" element={<LaboratoryManagement />} />
          <Route path="/staff/*" element={<StaffManagement />} />
          <Route path="/reports/*" element={<ReportingAnalytics />} />
          <Route path="/communications/*" element={<CommunicationMessaging />} />
          <Route path="/documents/*" element={<DocumentManagement />} />
          <Route path="/compliance/*" element={<ComplianceRegulatory />} />
          <Route path="/integrations/*" element={<IntegrationAPI />} />
          <Route path="/mobile/*" element={<MobileRemoteAccess />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

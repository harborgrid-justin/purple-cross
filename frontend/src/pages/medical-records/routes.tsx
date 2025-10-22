/**
 * WF-COMP-MEDICALRECORDS-002 | routes.tsx - MedicalRecords page routes
 * Purpose: MedicalRecords route configuration with role-based protection
 * Related: ProtectedRoute, medical-records components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import MedicalRecordsMain from './MedicalRecordsMain';
import MedicalRecordsDetail from './MedicalRecordsDetail';
import MedicalRecordsCreate from './MedicalRecordsCreate';
import MedicalRecordsEdit from './MedicalRecordsEdit';

export const MedicalRecordsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main MedicalRecords List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <MedicalRecordsMain />
          </ProtectedRoute>
        }
      />

      {/* Create New MedicalRecords */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <MedicalRecordsCreate />
          </ProtectedRoute>
        }
      />

      {/* View MedicalRecords Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <MedicalRecordsDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit MedicalRecords */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <MedicalRecordsEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default MedicalRecordsRoutes;

/**
 * WF-COMP-011 | routes.tsx - Patients page routes
 * Purpose: Patients route configuration with role-based protection
 * Related: ProtectedRoute, patients components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import PatientsMain from './PatientsMain';
import PatientsDetail from './PatientsDetail';
import PatientsCreate from './PatientsCreate';
import PatientsEdit from './PatientsEdit';

export const PatientsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Patients List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <PatientsMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Patient */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <PatientsCreate />
          </ProtectedRoute>
        }
      />

      {/* View Patient Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <PatientsDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Patient */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <PatientsEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default PatientsRoutes;

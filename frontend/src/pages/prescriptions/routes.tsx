/**
 * WF-COMP-PRESCRIPTIONS-002 | routes.tsx - Prescriptions page routes
 * Purpose: Prescriptions route configuration with role-based protection
 * Related: ProtectedRoute, prescriptions components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import PrescriptionsMain from './PrescriptionsMain';
import PrescriptionsDetail from './PrescriptionsDetail';
import PrescriptionsCreate from './PrescriptionsCreate';
import PrescriptionsEdit from './PrescriptionsEdit';

export const PrescriptionsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Prescriptions List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <PrescriptionsMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Prescriptions */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <PrescriptionsCreate />
          </ProtectedRoute>
        }
      />

      {/* View Prescriptions Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <PrescriptionsDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Prescriptions */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <PrescriptionsEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default PrescriptionsRoutes;

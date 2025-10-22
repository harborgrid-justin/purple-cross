/**
 * WF-COMP-LABORATORY-002 | routes.tsx - Laboratory page routes
 * Purpose: Laboratory route configuration with role-based protection
 * Related: ProtectedRoute, laboratory components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import LaboratoryMain from './LaboratoryMain';
import LaboratoryDetail from './LaboratoryDetail';
import LaboratoryCreate from './LaboratoryCreate';
import LaboratoryEdit from './LaboratoryEdit';

export const LaboratoryRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Laboratory List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <LaboratoryMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Laboratory */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <LaboratoryCreate />
          </ProtectedRoute>
        }
      />

      {/* View Laboratory Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <LaboratoryDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Laboratory */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <LaboratoryEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default LaboratoryRoutes;

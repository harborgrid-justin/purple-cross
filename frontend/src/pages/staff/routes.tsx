/**
 * WF-COMP-STAFF-002 | routes.tsx - Staff page routes
 * Purpose: Staff route configuration with role-based protection
 * Related: ProtectedRoute, staff components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import StaffMain from './StaffMain';
import StaffDetail from './StaffDetail';
import StaffCreate from './StaffCreate';
import StaffEdit from './StaffEdit';

export const StaffRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Staff List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <StaffMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Staff */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <StaffCreate />
          </ProtectedRoute>
        }
      />

      {/* View Staff Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <StaffDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Staff */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <StaffEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default StaffRoutes;

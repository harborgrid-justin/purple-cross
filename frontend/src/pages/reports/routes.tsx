/**
 * WF-COMP-REPORTS-002 | routes.tsx - Reports page routes
 * Purpose: Reports route configuration with role-based protection
 * Related: ProtectedRoute, reports components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import ReportsMain from './ReportsMain';
import ReportsDetail from './ReportsDetail';
import ReportsCreate from './ReportsCreate';
import ReportsEdit from './ReportsEdit';

export const ReportsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Reports List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ReportsMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Reports */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ReportsCreate />
          </ProtectedRoute>
        }
      />

      {/* View Reports Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ReportsDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Reports */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ReportsEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default ReportsRoutes;

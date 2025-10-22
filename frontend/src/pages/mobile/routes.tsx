/**
 * WF-COMP-MOBILE-002 | routes.tsx - Mobile page routes
 * Purpose: Mobile route configuration with role-based protection
 * Related: ProtectedRoute, mobile components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import MobileMain from './MobileMain';
import MobileDetail from './MobileDetail';
import MobileCreate from './MobileCreate';
import MobileEdit from './MobileEdit';

export const MobileRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Mobile List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <MobileMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Mobile */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <MobileCreate />
          </ProtectedRoute>
        }
      />

      {/* View Mobile Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <MobileDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Mobile */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <MobileEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default MobileRoutes;

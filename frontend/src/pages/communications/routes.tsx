/**
 * WF-COMP-COMMUNICATIONS-002 | routes.tsx - Communications page routes
 * Purpose: Communications route configuration with role-based protection
 * Related: ProtectedRoute, communications components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import CommunicationsMain from './CommunicationsMain';
import CommunicationsDetail from './CommunicationsDetail';
import CommunicationsCreate from './CommunicationsCreate';
import CommunicationsEdit from './CommunicationsEdit';

export const CommunicationsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Communications List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <CommunicationsMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Communications */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <CommunicationsCreate />
          </ProtectedRoute>
        }
      />

      {/* View Communications Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <CommunicationsDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Communications */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <CommunicationsEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default CommunicationsRoutes;

/**
 * WF-COMP-INTEGRATIONS-002 | routes.tsx - Integrations page routes
 * Purpose: Integrations route configuration with role-based protection
 * Related: ProtectedRoute, integrations components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import IntegrationsMain from './IntegrationsMain';
import IntegrationsDetail from './IntegrationsDetail';
import IntegrationsCreate from './IntegrationsCreate';
import IntegrationsEdit from './IntegrationsEdit';

export const IntegrationsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Integrations List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <IntegrationsMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Integrations */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <IntegrationsCreate />
          </ProtectedRoute>
        }
      />

      {/* View Integrations Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <IntegrationsDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Integrations */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <IntegrationsEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default IntegrationsRoutes;

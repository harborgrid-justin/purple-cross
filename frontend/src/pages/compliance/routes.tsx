/**
 * WF-COMP-COMPLIANCE-002 | routes.tsx - Compliance page routes
 * Purpose: Compliance route configuration with role-based protection
 * Related: ProtectedRoute, compliance components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import ComplianceMain from './ComplianceMain';
import ComplianceDetail from './ComplianceDetail';
import ComplianceCreate from './ComplianceCreate';
import ComplianceEdit from './ComplianceEdit';

export const ComplianceRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Compliance List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ComplianceMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Compliance */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ComplianceCreate />
          </ProtectedRoute>
        }
      />

      {/* View Compliance Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ComplianceDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Compliance */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ComplianceEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default ComplianceRoutes;

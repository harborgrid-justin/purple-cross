/**
 * WF-COMP-BILLING-002 | routes.tsx - Billing page routes
 * Purpose: Billing route configuration with role-based protection
 * Related: ProtectedRoute, billing components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import BillingMain from './BillingMain';
import BillingDetail from './BillingDetail';
import BillingCreate from './BillingCreate';
import BillingEdit from './BillingEdit';

export const BillingRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Billing List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <BillingMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Billing */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <BillingCreate />
          </ProtectedRoute>
        }
      />

      {/* View Billing Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <BillingDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Billing */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <BillingEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default BillingRoutes;

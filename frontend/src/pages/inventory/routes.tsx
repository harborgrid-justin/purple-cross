/**
 * WF-COMP-INVENTORY-002 | routes.tsx - Inventory page routes
 * Purpose: Inventory route configuration with role-based protection
 * Related: ProtectedRoute, inventory components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import InventoryMain from './InventoryMain';
import InventoryDetail from './InventoryDetail';
import InventoryCreate from './InventoryCreate';
import InventoryEdit from './InventoryEdit';

export const InventoryRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Inventory List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <InventoryMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Inventory */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <InventoryCreate />
          </ProtectedRoute>
        }
      />

      {/* View Inventory Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <InventoryDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Inventory */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <InventoryEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default InventoryRoutes;

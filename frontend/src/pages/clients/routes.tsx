/**
 * WF-COMP-Clients-002 | routes.tsx - Clients page routes
 * Purpose: Clients route configuration with role-based protection
 * Related: ProtectedRoute, Clients_LOWER components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import ClientsMain from './ClientsMain';
import ClientsDetail from './ClientsDetail';
import ClientsCreate from './ClientsCreate';
import ClientsEdit from './ClientsEdit';

export const ClientsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Clients List/Dashboard */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ClientsMain />
          </ProtectedRoute>
        } 
      />

      {/* Create New Clients */}
      <Route 
        path="/create" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ClientsCreate />
          </ProtectedRoute>
        } 
      />

      {/* View Clients Details */}
      <Route 
        path="/:id" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ClientsDetail />
          </ProtectedRoute>
        } 
      />

      {/* Edit Clients */}
      <Route 
        path="/:id/edit" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <ClientsEdit />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default ClientsRoutes;

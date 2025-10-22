/**
 * WF-COMP-DOCUMENTS-002 | routes.tsx - Documents page routes
 * Purpose: Documents route configuration with role-based protection
 * Related: ProtectedRoute, documents components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import DocumentsMain from './DocumentsMain';
import DocumentsDetail from './DocumentsDetail';
import DocumentsCreate from './DocumentsCreate';
import DocumentsEdit from './DocumentsEdit';

export const DocumentsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Documents List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <DocumentsMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Documents */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <DocumentsCreate />
          </ProtectedRoute>
        }
      />

      {/* View Documents Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <DocumentsDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Documents */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <DocumentsEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default DocumentsRoutes;

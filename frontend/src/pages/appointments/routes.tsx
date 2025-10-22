/**
 * WF-COMP-031 | routes.tsx - Appointments page routes
 * Purpose: Appointments route configuration with role-based protection
 * Related: ProtectedRoute, appointments components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import AppointmentsMain from './AppointmentsMain';
import AppointmentsDetail from './AppointmentsDetail';
import AppointmentsCreate from './AppointmentsCreate';
import AppointmentsEdit from './AppointmentsEdit';

export const AppointmentsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Appointments List/Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <AppointmentsMain />
          </ProtectedRoute>
        }
      />

      {/* Create New Appointment */}
      <Route
        path="/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <AppointmentsCreate />
          </ProtectedRoute>
        }
      />

      {/* View Appointment Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <AppointmentsDetail />
          </ProtectedRoute>
        }
      />

      {/* Edit Appointment */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'veterinarian', 'staff']}>
            <AppointmentsEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppointmentsRoutes;

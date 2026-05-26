import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * Gates a route on authentication and (optionally) role. Unauthenticated users
 * are sent to the login page (preserving their intended destination);
 * authenticated users lacking the required role are sent to the dashboard.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container" role="status" aria-live="polite" aria-label="Checking session">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

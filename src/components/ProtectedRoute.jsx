import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useKeyCheck } from '../hooks/useKeyCheck';

const ProtectedRoute = ({ children }) => {
  const { hasRequiredKeys } = useKeyCheck();
  const location = useLocation();

  if (!hasRequiredKeys) {
    // Redirect to config if keys are missing, preserving the attempted path
    return <Navigate to="/config" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

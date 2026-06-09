import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route protection wrapper.
 * Can restrict access by authentication status and specific roles (e.g. role="admin").
 */
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is not logged in, redirect them to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required but user doesn't have it, redirect to home page
  if (role && currentUser?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  if (user) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects = {
      admin: '/admin/dashboard',
      faculty: '/faculty/dashboard',
      student: '/student/dashboard',
    };
    return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
  }

  return children;
};

export default PublicRoute;

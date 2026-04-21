import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Common Components
import ProtectedRoute from './components/Common/ProtectedRoute';
import PublicRoute from './components/Common/PublicRoute';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageExams from './pages/Admin/ManageExams';
import AdminResults from './pages/Admin/ViewResults';
import PlaceholderPage from './pages/Common/PlaceholderPage';

// Faculty Pages
import FacultyDashboard from './pages/Faculty/Dashboard';
import CreateExam from './pages/Faculty/CreateExam';
import MyExams from './pages/Faculty/MyExams';
import FacultyResults from './pages/Faculty/Results';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import AvailableExams from './pages/Student/AvailableExams';
import StudentResults from './pages/Student/Results';
import TakeExam from './pages/Student/TakeExam';

// Layout
import Layout from './components/Layout/Layout';

function App() {
  const { user } = useAuth();

  // Get default dashboard based on role
  const getDefaultDashboard = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'faculty':
        return '/faculty/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PlaceholderPage title="System Logs" description="View system activity and logs." />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/results"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminResults />
          </ProtectedRoute>
        }
      />

      {/* Faculty Routes */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/create-exam"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <CreateExam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/my-exams"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <MyExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/results"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyResults />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exams"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AvailableExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exam/:id"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TakeExam />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to={getDefaultDashboard()} replace />}
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={<Navigate to={getDefaultDashboard()} replace />}
      />
    </Routes>
  );
}

export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AdminLayout from './components/layout/AdminLayout';

// Auth
import Login from './pages/auth/Login';

// Public
import Home from './pages/public/Home';
import ComponentList from './pages/public/ComponentList';
import ComponentDetail from './pages/public/ComponentDetail';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PendingComponents from './pages/admin/PendingComponents';
import AllComponents from './pages/admin/AllComponents';

// Contributor
import ContributorDashboard from './pages/contributor/ContributorDashboard';
import MyComponents from './pages/contributor/MyComponents';
import CreateComponent from './pages/contributor/CreateComponent';
import EditComponent from './pages/contributor/EditComponent';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-primary">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/components" element={<><Navbar /><ComponentList /></>} />
            <Route path="/components/:slug" element={<><Navbar /><ComponentDetail /></>} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="pending" element={<PendingComponents />} />
                      <Route path="components" element={<AllComponents />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Contributor Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['CONTRIBUTOR', 'ADMIN']}>
                  <AdminLayout>
                    <ContributorDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-components"
              element={
                <ProtectedRoute roles={['CONTRIBUTOR', 'ADMIN']}>
                  <AdminLayout>
                    <MyComponents />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/components/new"
              element={
                <ProtectedRoute roles={['CONTRIBUTOR', 'ADMIN']}>
                  <AdminLayout>
                    <CreateComponent />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/components/edit/:id"
              element={
                <ProtectedRoute roles={['CONTRIBUTOR', 'ADMIN']}>
                  <AdminLayout>
                    <EditComponent />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />


            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
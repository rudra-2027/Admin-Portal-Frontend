import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (user) {
        // Redirect to appropriate dashboard based on role
        if (user.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default GuestRoute;

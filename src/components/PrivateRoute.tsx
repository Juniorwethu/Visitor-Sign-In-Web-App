import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

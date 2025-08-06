import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Verifica si el usuario tiene un token válido en localStorage
const PrivateRoute = () => {
    const token = localStorage.getItem('token');

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

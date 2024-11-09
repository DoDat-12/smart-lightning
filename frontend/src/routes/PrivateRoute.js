import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';

const PrivateRoute = () => {
    const user = auth.currentUser;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default PrivateRoute;

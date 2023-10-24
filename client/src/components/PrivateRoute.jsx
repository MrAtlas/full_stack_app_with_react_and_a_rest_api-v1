import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function PrivateRoute() {
    // Access the authenticated user from the context
    const { authUser } = useContext(UserContext);
    // Get the current location
    const location = useLocation();

    if (authUser) {
        // If the user is authenticated, allow access to the child routes (Outlet)
        return <Outlet />;
    } else {
        // If the user is not authenticated, redirect to the signin page with the original location as state
        return <Navigate to="/signin" state={{ from: location.pathname }} />;
    }
}

export default PrivateRoute;

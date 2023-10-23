import React, { useContext } from 'react'
import UserContext from "../context/UserContext";
import { Navigate, Outlet, useLocation } from "react-router-dom"

function PrivateRoute() {

    const { authUser } = useContext(UserContext);
    const location = useLocation();

    if (authUser) {
        return <Outlet />
    } else {
        return <Navigate to="/signin" state={{ from: location.pathname }} />
    }

}

export default PrivateRoute
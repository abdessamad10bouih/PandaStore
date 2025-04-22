import React from 'react'
import Cookies from "js-cookie";
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
    const token = Cookies.get('store')

    if (token) {
        return <Outlet />
    } else {
        return <Navigate to='/login' />
    }
}

export default ProtectedRoutes
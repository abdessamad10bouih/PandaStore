
import Dashboard from '../pages/Dashboard';
import LoginForm from '../components/auth/Login';
import ProtectedRoutes from '../middlewares/ProtectedRoutes';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDashboard from '../pages/ProductDashboard';
import OneProduct from '../pages/OneProduit';
import FournisseurPage from '../pages/FournisseurPage';
import Categories from '../pages/Categories';
import ParametrePage from '../pages/ParametrePage';
import AidePage from '../pages/AidePage';
import FAQ from '../components/Help/FAQ';
import HomePage from '../pages/Store/HomePage';
import SignUp from '../components/auth/Signup';
import Posts from '../pages/Posts';
import ForgotPassword from '../components/auth/ForgotPassword';
import OTP from '../components/auth/OTP';
import ChangePass from '../components/auth/ChangePass';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginForm />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/reset-password' element={<ForgotPassword />} />
                <Route path='/verifierOTP' element={<OTP />} />
                <Route path='/changer-password' element={<ChangePass />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/dashboard/products' element={<ProductDashboard />} />
                    <Route path='/dashboard/products/:id' element={<OneProduct />} />
                    <Route path='/dashboard/fournisseurs' element={<FournisseurPage />} />
                    <Route path='/dashboard/categories' element={<Categories />} />
                    <Route path='/dashboard/parametres' element={<ParametrePage />} />
                    <Route path='/dashboard/posts' element={<Posts />} />
                    <Route path='/dashboard/aide'>
                        <Route index element={<AidePage />} />
                        <Route path='FAQ' element={<FAQ />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;

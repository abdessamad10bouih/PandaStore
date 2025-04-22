
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

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginForm />} />
                <Route path='/signup' element={<SignUp />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path='/Dashboard' element={<Dashboard />} />
                    <Route path='/products' element={<ProductDashboard />} />
                    <Route path='/products/:id' element={<OneProduct />} />
                    <Route path='/fournisseurs' element={<FournisseurPage />} />
                    <Route path='/categories' element={<Categories />} />
                    <Route path='/parametres' element={<ParametrePage />} />
                    <Route path='/posts' element={<Posts />} />
                    <Route path='/aide' element={<AidePage />} />
                    <Route path='/aide/FAQ' element={<FAQ />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;

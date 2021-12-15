import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { configApp } from '../config/app.config';
import { AuthenticatorGuard } from '../modules/auth/guards/authenticator.guard';
import { PublicGuard } from '../modules/auth/guards/public.guard';
import { LoginPage } from './admin/auth/Login';
import { AdminHomePage } from './admin/home/AdminHomePage';
import { ClientHomePage } from './client/home/ClientHomePage';

configApp();

function App(): JSX.Element {
    return <>
        <BrowserRouter>
            <Routes>
                <PublicGuard path='/login' element={<LoginPage/>}/>
                <AuthenticatorGuard path="/" element={<ClientHomePage/>} />
                <AuthenticatorGuard path="/admin" element={<AdminHomePage/>} />
            </Routes>
        </BrowserRouter>
    </>;
}

export default App;

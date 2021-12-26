import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { configApp } from '../config/app.config';
import { AuthRouteMapper } from '../modules/auth/auth-route.adapter';
import { LoginSuccessPage } from '../modules/auth/pages/LoginSuccessPage';
import { HomePage } from './home/HomePage';
import { AuthRestoreGuard } from '../modules/auth/guards/restore-guard';

configApp();

function App(): JSX.Element {
    return <>
        <AuthRestoreGuard>
            <BrowserRouter>
                <Routes>
                    {
                        AuthRouteMapper.toRoutes([
                            { path: '/login/success', element: LoginSuccessPage },
                            { path: '/', element: HomePage },
                        ], {
                            noPublicGuard: true
                        })
                    }
                </Routes>
            </BrowserRouter>
        </AuthRestoreGuard>
    </>;
}

export default App;

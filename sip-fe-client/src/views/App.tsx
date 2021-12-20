import React from 'react';
import 'antd/dist/antd.css';
import { HashRouter, Routes } from 'react-router-dom';
import { configApp } from '../config/app.config';
import { LoginPage } from './admin/auth/Login';
import { AdminHomePage } from './admin/home/AdminHomePage';
import { ClientHomePage } from './client/home/ClientHomePage';
import { AuthRouteMapper } from '../modules/auth/auth-route.adapter';

configApp();

function App(): JSX.Element {
    return <>
        <HashRouter>
            <Routes>
                {
                    AuthRouteMapper.toRoutes([
                        { path: '/login', element: LoginPage },
                        { path: '/admin', element: AdminHomePage },
                        { path: '/', element: ClientHomePage, protected: true },
                    ])
                }
            </Routes>
        </HashRouter>
    </>;
}

export default App;

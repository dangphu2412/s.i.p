import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { configApp } from '../config/app.config';
import { AuthRouteMapper } from '../modules/auth/auth-route.adapter';
import { HomePage } from './home/HomePage';

configApp();

function App(): JSX.Element {
    return <>
        <BrowserRouter>
            <Routes>
                {
                    AuthRouteMapper.toRoutes([
                        { path: '/', element: HomePage },
                    ])
                }
            </Routes>
        </BrowserRouter>
    </>;
}

export default App;

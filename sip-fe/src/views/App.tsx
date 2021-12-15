import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configApp } from '../config/app.config';
import { LoginPage } from './admin/auth/Login';
import { AdminHomePage } from './admin/home/AdminHomePage';
import { CLientHomePage } from './client/home/ClientHomePage';

configApp();

function App(): JSX.Element {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path="/" element={<CLientHomePage/>} />
                <Route path="/admin" element={<AdminHomePage/>} />
            </Routes>
        </BrowserRouter>
    </>;
}

export default App;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configAxios } from '../config/axios.config';
import { AdminHomePage } from './admin/home/AdminHomePage';
import { CLientHomePage } from './client/home/ClientHomePage';
import 'antd/dist/antd.css';
import { LoginPage } from './admin/auth/Login';

configAxios();

function App() {
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

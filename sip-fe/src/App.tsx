import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { configAxios } from './config/axios.config';
import { LoginPage } from './views/auth/LoginPage';

configAxios();

function App() {
	return <>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage/>} />
			</Routes>
		</BrowserRouter>
	</>;
}

export default App;

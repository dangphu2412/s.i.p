import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { configAxios } from './config/axios.config';
import { CLientHomePage } from './views/home/ClientHomePage';

configAxios();

function App() {
	return <>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<CLientHomePage/>} />
			</Routes>
		</BrowserRouter>
	</>;
}

export default App;

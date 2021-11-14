import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { configAxios } from './config/axios.config';

configAxios();

function App() {
	return (
		<div>
			<ToastContainer />
			<button onClick={() => toast('Hello dmm')}>Click me</button>
		</div>
	);
}

export default App;

import React from 'react';
import { RouteProps } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';

export function LoginPage(props: RouteProps) {
	return (
		<div>
			<ToastContainer />
			<button onClick={() => toast('Hello dmm')}>Click me</button>
		</div>
	);
}
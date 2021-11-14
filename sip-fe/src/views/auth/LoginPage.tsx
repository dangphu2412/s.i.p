import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { loginAction } from '../../modules/auth/auth.action';

export function LoginPage(props: RouteProps) {
	const dispatch = useDispatch();
	return (
		<div>
			<ToastContainer />
			<button onClick={() => {
				toast('Hello dmm');
				dispatch(loginAction());
			}
			}>Click me</button>
		</div>
	);
}
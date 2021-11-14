import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { cancelError } from '../../modules/error/error.action';
import { selectError } from '../../modules/error/error.selector';
import { AppError } from '../../modules/app.types';

export function ErrorBoundary() {
	const dispatch = useDispatch();
	const error: AppError = useSelector(selectError);

	if (error.hasError) {
		toast.error(error.message || 'Unexpected error happened');
		dispatch(cancelError());
	}
    
	return <>
		<ToastContainer />
	</>;
}

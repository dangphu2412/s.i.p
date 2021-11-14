import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router';
import { CLientLayout } from '../../../layouts/client/ClientLayout';
import { ErrorBoundary } from '../../common/ErrorBoundary';

export function CLientHomePage(props: RouteProps) {
	const dispatch = useDispatch();
	return (
		<>
			<ErrorBoundary/>
			<CLientLayout>
			</CLientLayout>
		</>
		
	);
}
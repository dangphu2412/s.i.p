import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router';
import { CLientLayout } from '../../layouts/client/ClientLayout';

export function CLientHomePage(props: RouteProps) {
	const dispatch = useDispatch();
	return (
		<CLientLayout>
			
		</CLientLayout>
	);
}
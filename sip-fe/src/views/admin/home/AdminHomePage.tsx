import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router';
import { AdminLayout } from '../../../layouts/admin/AdminLayout';
import { ErrorBoundary } from '../../common/ErrorBoundary';

export function AdminHomePage(props: RouteProps) {
	const dispatch = useDispatch();
	return (
		<>
			<ErrorBoundary/>
			<AdminLayout>
			Hello
			</AdminLayout>
		</>
	);
}
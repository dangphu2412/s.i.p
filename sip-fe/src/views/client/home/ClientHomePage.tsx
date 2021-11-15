import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router';
import { CLientLayout } from '../../../layouts/client/ClientLayout';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import { LoadingOverlay } from '../../common/LoadingOverlay';
export function CLientHomePage(props: RouteProps) {
	const dispatch = useDispatch();
	return (
		<>
			<ErrorBoundary/>
			<LoadingOverlay>
				<CLientLayout>
				</CLientLayout>
			</LoadingOverlay>
		</>
		
	);
}
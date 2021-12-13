import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router';
import { AdminLayout } from '../../../layouts/admin/AdminLayout';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import LoadingOverlay from 'react-loading-overlay';

export function AdminHomePage(props: RouteProps) {
    const dispatch = useDispatch();
    return (
        <>
            <ErrorBoundary/>
            <LoadingOverlay/>
            <AdminLayout>
			Hello
            </AdminLayout>
        </>
    );
}
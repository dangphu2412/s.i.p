import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { AdminLayout } from '../../../layouts/admin/AdminLayout';
import { ErrorBoundary } from '../../common/ErrorBoundary';

export function AdminHomePage(): JSX.Element {
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
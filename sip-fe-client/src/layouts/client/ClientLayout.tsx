import React from 'react';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';
import { ErrorBoundary } from '../../components/progress/ErrorBoundary';
import { LoadingOverlay } from '../../components/progress/LoadingOverlay';
import './index.scss';

export function ClientLayout() {
    return (
        <>
            <ErrorBoundary/>
            <LoadingOverlay>
                <ClientNavbar/>
            </LoadingOverlay>
        </>
    );
}
import React from 'react';
import { useDispatch } from 'react-redux';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';
import { ErrorBoundary } from '../../views/common/ErrorBoundary';
import { LoadingOverlay } from '../../views/common/LoadingOverlay';
import './index.scss';

export function ClientLayout() {
    const dispatch = useDispatch();
    return (
        <>
            <ErrorBoundary/>
            <LoadingOverlay>
                <ClientNavbar/>
            </LoadingOverlay>
        </>
    );
}
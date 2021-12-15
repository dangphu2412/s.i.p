import React from 'react';
import { CLientLayout } from '../../../layouts/client/ClientLayout';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import { LoadingOverlay } from '../../common/LoadingOverlay';

export function ClientHomePage(): JSX.Element {
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
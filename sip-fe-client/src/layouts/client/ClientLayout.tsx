import React from 'react';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';
import { ErrorBoundary } from '../../components/progress/ErrorBoundary';
import { LoadingOverlay } from '../../components/progress/LoadingOverlay';
import './index.scss';

interface Props {
    children: React.ReactNode
}

export function ClientLayout(props: Props): JSX.Element {
    return (
        <>
            <ErrorBoundary/>
            <LoadingOverlay>
                <ClientNavbar/>
                {props.children}
            </LoadingOverlay>
        </>
    );
}
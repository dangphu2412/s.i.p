import React from 'react';
import { AuthModal } from 'src/components/modal/AuthModal';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';
import { ErrorBoundary } from '../../components/progress/ErrorBoundary';
import { LoadingOverlay } from '../../components/progress/LoadingOverlay';
import './index.scss';

interface Props {
    children: React.ReactNode;
}

export function ClientLayout(props: Props): JSX.Element {
    return (
        <div>
            <ErrorBoundary/>
            <AuthModal/>
            <LoadingOverlay>
                <ClientNavbar/>
                {props.children}
            </LoadingOverlay>
        </div>
    );
}
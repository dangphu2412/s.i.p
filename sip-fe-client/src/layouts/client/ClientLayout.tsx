import React from 'react';
import { AuthModal } from 'src/components/modal/AuthModal';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';
import { NotificationContainer } from '../../components/progress/NotificationContainer';
import { LoadingOverlay } from '../../components/progress/LoadingOverlay';
import './index.scss';

interface Props {
    children: React.ReactNode;
}

export function ClientLayout(props: Props): JSX.Element {
    return (
        <div>
            <NotificationContainer/>
            <AuthModal/>
            <LoadingOverlay>
                <ClientNavbar/>
                {props.children}
            </LoadingOverlay>
        </div>
    );
}

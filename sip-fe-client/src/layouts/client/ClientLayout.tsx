import React from 'react';
import { AuthModal } from 'src/components/modal/AuthModal';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';
import { NotificationContainer } from '../../components/progress/NotificationContainer';
import { LoadingOverlay } from '../../components/progress/LoadingOverlay';
import './index.scss';

export type Props = React.ComponentProps<'div'>;

export function ClientLayout({className, ...rest}: Props): JSX.Element {
    return (
        <>
            <NotificationContainer/>
            <AuthModal/>
            <LoadingOverlay>
                <ClientNavbar/>
                <div {...rest} className={`h-full ${className ? className : ''}`}>
                    {rest.children}
                </div>
            </LoadingOverlay>
        </>
    );
}

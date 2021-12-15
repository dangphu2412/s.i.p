import { RouteProps } from 'react-router-dom';
import { AuthenticatorGuard } from './guards/authenticator.guard';
import { PublicGuard } from './guards/public.guard';

export interface AuthRouteConnector extends RouteProps {
    protect?: boolean;
}


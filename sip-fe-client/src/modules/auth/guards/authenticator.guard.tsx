import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { AuthType } from '../auth.reducer';
import { selectAuthState } from '../auth.selector';
import { AuthConfig, AuthConfigKeys } from '../config/auth.config';

export interface GuardProps {
    element: JSX.Element;
}

export function AuthenticatorGuard({element}: GuardProps): JSX.Element {
    const authState = useSelector(selectAuthState);
    return authState === AuthType.LOGGED_IN ?
        element
        : <Navigate to={{ pathname: AuthConfig.get(AuthConfigKeys.REDIRECT_ROUTE_KEY) }} />;
}
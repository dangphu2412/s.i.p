import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { AuthType } from '../auth.reducer';
import { selectAuthState } from '../auth.selector';
import { AuthConfig, AuthConfigKeys } from '../config/auth.config';

export function PublicGuard({element}: { element: JSX.Element}): JSX.Element {
    const authState = useSelector(selectAuthState);
    return authState === AuthType.LOGGED_IN ?
        <Navigate to={{ pathname: AuthConfig.get(AuthConfigKeys.DEFAULT_ROUTE_KEY) }} />
        : element;
}

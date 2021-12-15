import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Navigate, RouteProps } from 'react-router-dom';
import { AuthType } from '../auth.reducer';
import { selectAuthState } from '../auth.selector';
import { AuthConfig, AuthConfigKeys } from '../config/auth.config';

export function PublicGuard({element, ...props}: RouteProps): JSX.Element {
    const authState = useSelector(selectAuthState);
    return (
        authState.authState === AuthType.LOGGED_IN ?
            <Navigate to={{ pathname: AuthConfig.get(AuthConfigKeys.DEFAULT_ROUTE_KEY) }} />
            : <Route {...props} element={element} />
    );
}
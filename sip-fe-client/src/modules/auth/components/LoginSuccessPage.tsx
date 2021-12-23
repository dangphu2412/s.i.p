import React, { useEffect } from 'react';
import { HttpServer } from '../../http/http.server';
import { AuthConfig, AuthConfigKeys } from '../config/auth.config';

export interface AuthProps {
    accessToken: string;
    refreshToken: string;
    profile: Profile
}

export interface Profile {
    fullName: string;
}

export function LoginSuccessPage(): JSX.Element {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken') || '';
        const refreshToken = urlParams.get('refreshToken') || '';
        HttpServer.doGet('/user/me')
            .then((profile: Profile) => {
                if (profile instanceof Error) {
                    window.close();
                    return;
                }
            
                const authState: AuthProps = {
                    accessToken,
                    refreshToken,
                    profile
                };
            
                localStorage.setItem(
                    AuthConfig.get(AuthConfigKeys.AUTH_STATE_KEY),
                    JSON.stringify(authState)
                );
                window.close();
            });
    }, []);
    return <></>;
}
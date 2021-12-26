import axios from 'axios';
import React, { useEffect } from 'react';
import { getMe, Profile } from '../auth.service';
import { AuthConfig, AuthConfigKeys } from '../config/auth.config';

export interface AuthProps {
    accessToken: string;
    profile: Profile
}

export function LoginSuccessPage(): JSX.Element {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken') || '';

        window.localStorage.setItem(AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY), `Bearer ${accessToken}`);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        const request = getMe();
        request
            .doRequest()
            .then(() => {
                let authProps: AuthProps;
                try {
                    authProps = {
                        accessToken,
                        profile: request.getData()
                    };
                } catch(e) {
                    window.close();
                    return;
                }
            
                localStorage.setItem(
                    AuthConfig.get(AuthConfigKeys.AUTH_STATE_KEY),
                    JSON.stringify(authProps)
                );
                window.close();
            });
    }, []);
    return <></>;
}
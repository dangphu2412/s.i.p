import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface AuthState {
    accessToken: string;
    refreshToken: string;
}

export function LoginSuccessPage(): JSX.Element {
    const dispatch = useDispatch();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        const authState = {
            accessToken,
            refreshToken,
        };
        localStorage.setItem('auth-state', JSON.stringify(authState));
        
        // window.close();
    }, []);
    return <></>;
}
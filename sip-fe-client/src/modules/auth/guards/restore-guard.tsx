import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouterProps } from 'react-router-dom';
import { restoreAction } from '../auth.action';

export function AuthRestoreGuard({ children }: BrowserRouterProps): JSX.Element {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(restoreAction());
    }, []);

    return (
        <div>
            { children }
        </div>
    );
}

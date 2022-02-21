import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouterProps } from 'react-router-dom';
import { restoreAction } from '../auth.action';
import { selectRestoreStatus } from '../auth.selector';

export function AuthRestoreGuard({ children }: BrowserRouterProps): JSX.Element | null {
    const dispatch = useDispatch();
    const restoreStatus = useSelector(selectRestoreStatus);
    useEffect(() => {
        dispatch(restoreAction());
    }, []);

    return restoreStatus
        ? (<>{ children }</>)
        : null;
}

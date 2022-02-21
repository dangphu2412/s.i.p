import React from 'react';
import LoadingOverlayComponent from 'react-loading-overlay';
import { useSelector } from 'react-redux';
import { AppLoading } from '../../modules/app.types';
import { selectLoading } from '../../modules/loading/loading.selector';

export function LoadingOverlay<T>(props: { children: T}): JSX.Element {
    const loading: AppLoading = useSelector(selectLoading);
    return (
        <LoadingOverlayComponent
            active={loading.isLoading}
            spinner
            text={loading.content}
            className='h-full'
        >
            {props.children}
        </LoadingOverlayComponent>
    );
}

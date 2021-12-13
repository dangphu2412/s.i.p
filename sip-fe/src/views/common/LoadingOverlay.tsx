import React from 'react';
import LoadingOverlayComponent from 'react-loading-overlay';
import { useSelector } from 'react-redux';
import { AppLoading } from '../../modules/app.types';
import { selectLoading } from '../../modules/loading/loading.selector';

export function LoadingOverlay<T>(props: { children: T}) {
    const loading: AppLoading = useSelector(selectLoading);
    return (
        <div>
            <LoadingOverlayComponent
                active={loading.isLoading}
                spinner
                text={loading.content}
            >
                {props.children}
            </LoadingOverlayComponent>
        </div>
    );
}

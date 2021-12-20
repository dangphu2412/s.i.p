import React from 'react';
import { useDispatch } from 'react-redux';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';
import { fireError } from '../../modules/error/error.action';
import { setLoading } from '../../modules/loading/loading.action';

export function CLientLayout() {
    const dispatch = useDispatch();
    return (
        <>
            <ClientNavbar title="Client"/>
            <button onClick={() => {
                dispatch(fireError({message: 'Hello con di'}));
                dispatch(setLoading({ isLoading: true, content: 'Saving the data' }));
                setTimeout(() => {
                    dispatch(setLoading({ isLoading: false }));
                }, 500);
            }}>Click</button>
        </>
    );
}
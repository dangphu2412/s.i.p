import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import './index.scss';

export function UnAuthenticatePage(): JSX.Element {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(openAuthPopupAction());
    }, []);

    return <ClientLayout>
        <div className='cover'>
            <div className="wrapper">
                <div className="box">
                    <div className='title'>401</div>
                    <p className='content'>Sorry, it s not allowed to go beyond this point!</p>
                    <p className='content'><a href="/">Please, go back this way.</a></p>
                </div>
            </div>
        </div>
    </ClientLayout>;
}

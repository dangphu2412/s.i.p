import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { resetMessage } from '../../modules/message/message.action';
import { selectMessage } from '../../modules/message/message.selector';
import { AppMessage, MessageType } from '../../modules/app.types';

export function NotificationContainer(): JSX.Element {
    const dispatch = useDispatch();
    const message: AppMessage = useSelector(selectMessage);

    useEffect(() => {
        if (message.type === MessageType.ERROR) {
            toast.error(message.message || 'Unexpected error happened', {
                autoClose: false
            });
            dispatch(resetMessage());
            return;
        }

        if (message.type === MessageType.INFO) {
            toast.info(message.message || '');
            dispatch(resetMessage());
            return;
        }

        if (message.type === MessageType.SUCCESS) {
            toast.success(message.message || '');
            dispatch(resetMessage());
            return;
        }
    }, [message]);

    return <>
        <ToastContainer />
    </>;
}

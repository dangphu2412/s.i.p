import { GoogleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageType } from 'src/modules/app.types';
import { closeAuthPopupAction, loggedInAction, loggingAction } from 'src/modules/auth/auth.action';
import { selectModalOpenState } from 'src/modules/auth/auth.selector';
import { getLoginUrl } from 'src/modules/auth/auth.service';
import { AuthConfig, AuthConfigKeys } from 'src/modules/auth/config/auth.config';
import { fireMessage } from 'src/modules/message/message.action';
import { setLoading } from 'src/modules/loading/loading.action';

export function AuthModal(): JSX.Element {
    const dispatch = useDispatch();
    const isOpening: boolean | undefined = useSelector(selectModalOpenState);

    function loginGoogle() {
        dispatch(loggingAction());

        const newWindow = window.open(getLoginUrl(), '_blank', 'width=500,height=600');
        dispatch(setLoading({ isLoading: true }));
        const interval = setInterval(() => {
            if (newWindow?.closed) {
                clearInterval(interval);

                const profile = localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_STATE_KEY));

                if (!profile) {
                    dispatch(fireMessage(
                        {
                            message: 'Cannot login at the moment. Please try again later',
                            type: MessageType.ERROR
                        }
                    ));
                    return;
                }

                dispatch(loggedInAction({
                    profile: JSON.parse(profile as string)
                }));
                axios.defaults.headers.common['Authorization'] = window.localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY)) || '';
                dispatch(setLoading({ isLoading: false }));
                dispatch(closeAuthPopupAction());
                location.href = '/';
            }
        }, 5000);
    }

    return <Modal
        title="Login"
        visible={isOpening}
        onOk={() => loginGoogle()}
        onCancel={() => dispatch(closeAuthPopupAction())}
        okText="Login with google"
        okButtonProps={{
            icon: <GoogleOutlined />,
            danger: true
        }}
    >
        <div className='text-center'>
            <Avatar
                src={'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Coffee-2346113.svg/1200px-Coffee-2346113.svg.png'}
                size={96}
            />
            <Title className='mt-5' level={4}>
                Sign in to S.I.P
            </Title>

            <div>
                Join our community of friendly folks discovering and sharing the latest products in tech.
            </div>
        </div>
    </Modal>;
}

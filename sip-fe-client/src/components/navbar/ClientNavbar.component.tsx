import React from 'react';
import '../../scss/global.scss';
import './index.scss';
import { GoogleOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Input, Menu, message, Row, Avatar, Image  } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import { loggedInAction, loggingAction, logoutAction } from '../../modules/auth/auth.action';
import { AuthType } from '../../modules/auth/auth.reducer';
import { selectAuthState } from '../../modules/auth/auth.selector';
import { getLoginUrl } from '../../modules/auth/auth.service';
import { AuthConfig, AuthConfigKeys } from '../../modules/auth/config/auth.config';
import { fireError } from '../../modules/error/error.action';
import { setLoading } from '../../modules/loading/loading.action';

export function ClientNavbar(): JSX.Element {
    const dispatch = useDispatch();
    const authState = useSelector(selectAuthState);

    function loginGoogle() {
        dispatch(loggingAction());

        const newWindow = window.open(getLoginUrl(), '_blank', 'width=500,height=600');
        dispatch(setLoading({ isLoading: true }));
        const interval = setInterval(() => {
            if (newWindow?.closed) {
                clearInterval(interval);

                const profile = localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_STATE_KEY));

                if (!profile) {
                    dispatch(fireError({message: 'Cannot login at the moment. Please try again later'}));
                    return;
                }

                dispatch(loggedInAction({
                    profile: JSON.parse(profile as string)
                }));
                dispatch(setLoading({ isLoading: false }));
            } 
        }, 5000);
    }

    function onLogout(menuInfo: MenuInfo) {
        menuInfo.domEvent.preventDefault();
        message.info('Logging out');
        dispatch(logoutAction());
    }

    return (
        <div className='shadow-md'>
            <Row className='header-wrapper'>
                <Col className='p-left-container' span={1}>
                    <Button type="primary" shape="circle" size='large'>
                        <a href='/'>S.I.P</a>
                    </Button>
                </Col>
                <Col className='f-center p-left-container my-3' span={3}>
                    <Input  placeholder="Search Products ..." />
                </Col>
                <Col className='' span={14}>
                    <Menu mode="horizontal" className={'override-line-height-menu'}>
                        <Menu.Item key="1">Products</Menu.Item>
                        <Menu.Item key="2">Topics</Menu.Item>
                        <Menu.Item key="3">Recommend</Menu.Item>
                    </Menu>
                </Col>
                <Col className='adjust-avatar-to-the-end p-right-container' span={6}>
                    {
                        authState === AuthType.LOGGED_IN
                            ? <Dropdown overlay={
                                <Menu mode={'horizontal'}>
                                    <Menu.Item key="1">Profile</Menu.Item>
                                    <Menu.Item key="2">Your products</Menu.Item>
                                    <Menu.Item key="3" onClick={onLogout}>Logout</Menu.Item>
                                </Menu>
                            }>
                                <Avatar src={
                                    <Image
                                        src="https://joeschmoe.io/api/v1/random"
                                        style={{ width: 36 }}
                                        preview={false}
                                    />}
                                />
                            </Dropdown>
                            : <Button
                                className="ant-dropdown-link" 
                                type="primary"
                                shape="circle"
                                size='large' 
                                onClick={() => loginGoogle()}
                            >
                                <GoogleOutlined/>
                            </Button>
                    }
                </Col>
            </Row>
        </div>
    );
}
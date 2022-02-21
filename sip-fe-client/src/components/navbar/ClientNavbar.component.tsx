import { GoogleOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Image, Input, Menu, message } from 'antd';
import axios from 'axios';
import { MenuInfo } from 'rc-menu/lib/interface';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MessageType } from 'src/modules/app.types';
import { loggedInAction, loggingAction, logoutAction } from '../../modules/auth/auth.action';
import { AuthType } from '../../modules/auth/auth.reducer';
import { selectAuthState, selectProfile } from '../../modules/auth/auth.selector';
import { getLoginUrl } from '../../modules/auth/auth.service';
import { AuthConfig, AuthConfigKeys } from '../../modules/auth/config/auth.config';
import { fireMessage } from '../../modules/message/message.action';
import { setLoading } from '../../modules/loading/loading.action';
import './index.scss';

export function ClientNavbar(): JSX.Element {
    const dispatch = useDispatch();
    const authState = useSelector(selectAuthState);
    const profile = useSelector(selectProfile);

    function loginGoogle() {
        dispatch(loggingAction());

        const newWindow = window.open(getLoginUrl(), '_blank', 'width=500,height=600');
        dispatch(setLoading({ isLoading: true }));
        const interval = setInterval(() => {
            if (newWindow?.closed) {
                clearInterval(interval);

                const profile = localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_STATE_KEY));

                if (!profile) {
                    dispatch(fireMessage({
                        message: 'Cannot login at the moment. Please try again later',
                        type: MessageType.ERROR
                    }));
                    return;
                }

                dispatch(loggedInAction({
                    profile: JSON.parse(profile as string)
                }));
                axios.defaults.headers.common['Authorization'] = window.localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY)) || '';
                dispatch(setLoading({ isLoading: false }));
                location.href = '/';
            }
        }, 5000);
    }

    function onLogout(menuInfo: MenuInfo) {
        menuInfo.domEvent.preventDefault();
        message.info('Logging out');
        dispatch(logoutAction());
        location.href = '/';
    }

    return (
        <div className='shadow-sm cover-bg'>
            <div className='header-wrapper flex justify-between'>
                <div className='p-left-container flex items-center'>
                    <Button danger className='btn-bg btn-bg-hover' shape="circle" size='large'>
                        <a href='/'>S.I.P</a>
                    </Button>

                    <div className='my-3 ml-8'>
                        <Input style={{backgroundColor: '#F0F9FF'}} className='bg-sky-light' placeholder="Search Products ..." />
                    </div>

                    <div className='max-w-3xl w-full'>
                        <Menu mode="horizontal" className='override-line-height-menu cover-bg'>
                            <Menu.Item className='cover-bg' key="1">
                                <Link to="/">
                                    Products
                                </Link>
                            </Menu.Item>
                            <Menu.Item className='cover-bg' key="2">
                                <Link to="/ideas">
                                    Ideas
                                </Link>
                            </Menu.Item>
                            <Menu.Item className='cover-bg' key="3">
                                <Link to="/topics">
                                    Topics
                                </Link>
                            </Menu.Item>
                            <Menu.Item className='cover-bg' key="4">
                                <Link to="/discussions">
                                    Discussions
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>

                <div className='p-right-container f-center' >
                    <Dropdown placement='bottomRight' overlay={
                        <Menu>
                            <Menu.Item key="1">
                                <Link to='/posts/new'>
                                    Create new product
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="1">
                                <Link to='/discussions/new'>
                                    New discussion
                                </Link>
                            </Menu.Item>

                        </Menu>
                    }
                    >
                        <div className='mr-5 text-lg button-text-color cursor-pointer'>
                            Let&#39;s hunt
                        </div>
                    </Dropdown>
                    {
                        authState === AuthType.LOGGED_IN
                            ? <Dropdown overlay={
                                <Menu mode={'horizontal'}>
                                    <Menu.Item key="2">
                                        <Link to='/settings'>
                                            My settings
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="1">
                                        <Link to={`/sipers/${profile?.hashTag}`}>
                                            Profile
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <Link to='/me/products'>
                                            My ideas
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="3" onClick={onLogout}>Logout</Menu.Item>
                                </Menu>
                            }
                            >
                                <Avatar src={
                                    <Image
                                        src={profile?.avatar}
                                        style={{ width: 36 }}
                                        preview={false}
                                    />}
                                />
                            </Dropdown>
                            : <Button
                                className="ant-dropdown-link btn-bg btn-bg-hover"
                                shape="circle"
                                size='large'
                                danger
                                onClick={() => loginGoogle()}
                            >
                                <GoogleOutlined/>
                            </Button>
                    }
                </div>
            </div>
        </div>
    );
}

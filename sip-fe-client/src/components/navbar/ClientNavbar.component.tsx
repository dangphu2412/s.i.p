import React from 'react';
import './index.scss';
import { GoogleOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Input, Menu, message, Row, Avatar, Image  } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import { loggedInAction, loggingAction, logoutAction } from '../../modules/auth/auth.action';
import { AuthType } from '../../modules/auth/auth.reducer';
import { selectAuthState, selectProfile } from '../../modules/auth/auth.selector';
import { getLoginUrl } from '../../modules/auth/auth.service';
import { AuthConfig, AuthConfigKeys } from '../../modules/auth/config/auth.config';
import { fireError } from '../../modules/error/error.action';
import { setLoading } from '../../modules/loading/loading.action';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
                    dispatch(fireError({message: 'Cannot login at the moment. Please try again later'}));
                    return;
                }

                dispatch(loggedInAction({
                    profile: JSON.parse(profile as string)
                }));
                axios.defaults.headers.common['Authorization'] = window.localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY)) || '';
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
        <div className='shadow-sm cover-bg'>
            <Row className='header-wrapper'>
                <Col className='p-left-container' span={2}>
                    <Button className='btn-bg btn-bg-hover' shape="circle" size='large'>
                        <a href='/'>S.I.P</a>
                    </Button>
                </Col>
                <Col className='f-center my-3' span={3}>
                    <Input style={{backgroundColor: '#F0F9FF'}} className='bg-sky-light' placeholder="Search Products ..." />
                </Col>
                <Col span={13}>
                    <Menu mode="horizontal" className='override-line-height-menu cover-bg'>
                        <Menu.Item className='cover-bg' key="1">
                            <Link to="/"> 
                                Products
                            </Link>
                        </Menu.Item>
                        <Menu.Item className='cover-bg' key="2">
                            <Link to="/topics"> 
                                Topics
                            </Link>
                        </Menu.Item>
                        <Menu.Item className='cover-bg' key="3">
                            <Link to="/recommend"> 
                                Recommend
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Col>
                <Col className='adjust-avatar-to-the-end p-right-container f-center' span={6}>
                    <Dropdown overlay={
                        <Menu mode={'horizontal'}>
                            <Menu.Item key="1">
                                <Link to='/posts/new'>
                                    Create new product
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
                                    <Menu.Item key="1">
                                        <Link to={`/siper/${profile?.username}`}>
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
                                        src="https://joeschmoe.io/api/v1/random"
                                        style={{ width: 36 }}
                                        preview={false}
                                    />}
                                />
                            </Dropdown>
                            : <Button
                                className="ant-dropdown-link btn-bg btn-bg-hover"
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
import { GoogleOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Input, Menu, message, Row } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../modules/auth/auth.action';
import { AuthState, AuthType } from '../../modules/auth/auth.reducer';
import { selectAuthState } from '../../modules/auth/auth.selector';
import './index.scss';
import '../../scss/global.scss';

export function ClientNavbar(props: {title?: string, children?: React.ReactNode}) {
    const dispatch = useDispatch();
    const userState: AuthState = useSelector(selectAuthState);

    function onLogout(menuInfo: MenuInfo) {
        menuInfo.domEvent.preventDefault();
        message.info('Logging out');
        dispatch(logoutAction());
    }

    function onLogin(event: React.MouseEvent<HTMLElement>) {
        window.open('http://localhost:3000/login/success?accessToken=test&refreshToken=test', '_blank', 'width=500,height=600');
        // dispatch(loginAction({ username: '', password: '' }));
        const interval = setInterval(() => {
            if (!window) {
                clearInterval(interval);
            } 
        }, 5000);
    }

    return (
        <Row className='shadow-md'>
            <Col className='f-center my-3' span={2}>
                <Button type="primary" shape="circle" size='large'>
                    S
                </Button>
            </Col>
            <Col className='f-center my-3' span={4}>
                <Input  placeholder="Search" />
            </Col>
            <Col className='' span={12}>
                <Menu mode="horizontal">
                    <Menu.Item key="1">Products</Menu.Item>
                    <Menu.Item key="2">Topics</Menu.Item>
                    <Menu.Item key="3">Recommend</Menu.Item>
                </Menu>
            </Col>
            <Col className='f-center my-3' span={4}>
                {
                    userState.authState === AuthType.LOGGED_IN
                        ? <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="1">Profile</Menu.Item>
                                <Menu.Item key="2">Your products</Menu.Item>
                                <Menu.Item key="3" onClick={onLogout}>Logout</Menu.Item>
                            </Menu>
                        }>
                            <Button className="ant-dropdown-link" type="primary" shape="circle" onClick={e => e.preventDefault()}>
                            S.I.P
                            </Button>
                        </Dropdown>
                        : <Button className="ant-dropdown-link" type="primary" shape="circle" size='large' onClick={onLogin}>
                            <GoogleOutlined/>
                        </Button>
                }
                
                
            </Col>
        </Row>
    );
}
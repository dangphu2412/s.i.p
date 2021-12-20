import { Row, Col, Button, Input, Menu, Dropdown, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import React from 'react';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { MenuInfo } from 'rc-menu/lib/interface';
import { loginAction, logoutAction } from '../../modules/auth/auth.action';
import { selectAuthState } from '../../modules/auth/auth.selector';
import { AuthState, AuthType } from '../../modules/auth/auth.reducer';

export function ClientNavbar(props: {title?: string, children?: React.ReactNode}) {
    const dispatch = useDispatch();
    const userState: AuthState = useSelector(selectAuthState);

    function onLogout(menuInfo: MenuInfo) {
        menuInfo.domEvent.preventDefault();
        message.info('Logging out');
        dispatch(logoutAction());
    }

    function onLogin(event: React.MouseEvent<HTMLElement>) {
        dispatch(loginAction({ username: '', password: '' }));
    }

    return (
        <Row>
            <Col span={2}>
                <Button type="primary" shape="circle">
                    S.I.P
                </Button>
            </Col>
            <Col span={4}>
                <Input placeholder="Search" />
            </Col>
            <Col span={12}>
                <Menu mode="horizontal">
                    <Menu.Item key="1">Products</Menu.Item>
                    <Menu.Item key="2">Topics</Menu.Item>
                    <Menu.Item key="3">Recommend</Menu.Item>
                </Menu>
            </Col>
            <Col span={4}>
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
                        : <Button className="ant-dropdown-link" type="primary" shape="circle" onClick={onLogin}>
                            <GoogleOutlined/>
                        </Button>
                }
                
                
            </Col>
        </Row>
    );
}
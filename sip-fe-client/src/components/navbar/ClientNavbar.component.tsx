import { Row, Col, Button, Input, Menu, Dropdown, message } from 'antd';
import React from 'react';
import './index.scss';
import { useDispatch } from 'react-redux';
import { MenuInfo } from 'rc-menu/lib/interface';
import { logoutAction } from '../../modules/auth/auth.action';

export function ClientNavbar(props: {title?: string, children?: React.ReactNode}) {
    const dispatch = useDispatch();

    function onLogout(menuInfo: MenuInfo) {
        menuInfo.domEvent.preventDefault();
        message.info('Logging out');
        dispatch(logoutAction());
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
                <Dropdown overlay={
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
                
            </Col>
        </Row>
    );
}
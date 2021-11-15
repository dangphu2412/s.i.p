import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router-dom';
import './admin-layout.scss';

const { Header, Content, Footer, Sider } = Layout;

export function AdminLayout(props: RouteProps) {
	const dispatch = useDispatch();
	return (


		<Layout>
			<Sider
				style={{
					overflow: 'auto',
					height: '100vh',
					position: 'fixed',
					left: 0,
				}}
			>
				<div className="logo" />
				<Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
					<Menu.Item key="1" icon={<UserOutlined />}>
          nav 1
					</Menu.Item>
					<Menu.Item key="2" icon={<VideoCameraOutlined />}>
          nav 2
					</Menu.Item>
				</Menu>
			</Sider>
			<Layout className="site-layout" style={{ marginLeft: 200 }}>
				<Header className="site-layout-background" style={{ padding: 0 }} />
				<Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
					<div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
						Content here
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					S.I.P ©2021 Created by S.I.P Teams
				</Footer>
			</Layout>
		</Layout>
	);
}
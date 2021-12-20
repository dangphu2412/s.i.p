import React from 'react';
import { Button, Checkbox, Col, Form, Image, Input, Row } from 'antd';
import { useDispatch } from 'react-redux';
import { loginAction, LoginPayload } from '../../modules/auth/auth.action';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { LoadingOverlay } from '../common/LoadingOverlay';

export function LoginPage(): JSX.Element {
    const dispatch = useDispatch();

    const onFinish = (loginPayload: LoginPayload) => {
        dispatch(loginAction({
            username: loginPayload.username,
            password: loginPayload.password
        }));
    };

    return (
        <>
            <ErrorBoundary/>
            <LoadingOverlay>
                <Row>
                    <Col span={12}>
                        <Image
                            preview={false}
                            width={'auto'}
                            height={'100vh'}
                            src="./img/login.jpg"
                        />
                    </Col>
                    <Col span={12}>
                        <h2>Log in</h2>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
									Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </LoadingOverlay>
            
        </>
    );
}
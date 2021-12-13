import React from 'react';
import { RouteProps } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Row, Col, Image } from 'antd';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { fireError } from '../../../modules/error/error.action';
import { setLoading } from '../../../modules/loading/loading.action';
import { LoadingOverlay } from '../../common/LoadingOverlay';

export function LoginPage(props: RouteProps) {
    const dispatch = useDispatch();

    const onFinish = (values: any) => {
        dispatch(setLoading({ isLoading: true, content: 'Saving the data' }));
    };
	
    const onFinishFailed = (errorInfo: any) => {
        dispatch(fireError({message: errorInfo}));
        dispatch(setLoading({ isLoading: false }));
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
                            onFinishFailed={onFinishFailed}
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
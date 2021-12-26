import { Button, Card, Col, Divider, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import { ClientLayout } from '../../layouts/client/ClientLayout';

export function HomePage(): JSX.Element {
    return (
        <>
            <ClientLayout>
                <Row>
                    <Col span={16}>
                        <Title level={2}>Let&#39;s get some idea 💩</Title>
                        <Content>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita dolore amet quam voluptates vero nesciunt nemo, cupiditate non dolorum. Deleniti dolorum recusandae sequi esse. Vero voluptatum impedit similique inventore alias?
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita dolore amet quam voluptates vero nesciunt nemo, cupiditate non dolorum. Deleniti dolorum recusandae sequi esse. Vero voluptatum impedit similique inventore alias?
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita dolore amet quam voluptates vero nesciunt nemo, cupiditate non dolorum. Deleniti dolorum recusandae sequi esse. Vero voluptatum impedit similique inventore alias?
                        </Content>
                    </Col>

                    <Col span={1}>
                        <Divider type="vertical" style={{ height: '100px', backgroundColor: '#000' }}/>
                    </Col>

                    <Col span={7}>
                        <a href='#'>You may interested</a>

                        <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>

                        <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                </Row>
            </ClientLayout>
        </>
    );
}
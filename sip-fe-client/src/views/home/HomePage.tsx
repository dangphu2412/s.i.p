import React, { useState } from 'react';
import Title from 'antd/lib/typography/Title';
import { Card, Col, Divider, Dropdown, Menu, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { ClientLayout } from '../../layouts/client/ClientLayout';
import { Container } from '../../components/container/Container';
import { DownOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';

enum PostFilter {
    HOTTEST = 'Hottest',
    NEWEST = 'Newest'
}

export function HomePage(): JSX.Element {
    const [selectedFilter, setSelectedFilter] = useState(PostFilter.HOTTEST);
    function handleFilterChoose(e: MenuInfo) {
        setSelectedFilter(e.key as PostFilter);
    }

    return (
        <>
            <ClientLayout>
                <Container>
                    <Row>
                        <Col span={16}>
                            <Title level={2}>Let&#39;s get some idea 💩</Title>

                            <Dropdown overlay={
                                <Menu onClick={handleFilterChoose}>
                                    <Menu.Item key={PostFilter.HOTTEST}>
                                        {PostFilter.HOTTEST}
                                    </Menu.Item>
                                    <Menu.Item key={PostFilter.NEWEST}>
                                        {PostFilter.NEWEST}
                                    </Menu.Item>
                                </Menu>
                            }>
                                <a className="ant-dropdown-link text-lg" onClick={e => e.preventDefault()}>
                                    {selectedFilter} <DownOutlined />
                                </a>
                            </Dropdown>

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
                </Container>
            </ClientLayout>
        </>
    );
}
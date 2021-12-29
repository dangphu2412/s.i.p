import { Card, Col, Divider, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import CardContainer from 'src/modules/post/components/card/CardContainer';
import { Container } from '../../components/container/Container';
import { ClientLayout } from '../../layouts/client/ClientLayout';
import { FilterDropdown } from '../../modules/post/components/dropdown/FilterDropdown';


export function HomePage(): JSX.Element {
    return (
        <>
            <ClientLayout>
                <Container>
                    <Row>
                        <Col span={16}>
                            <Title level={2}>Let&#39;s get some idea 💩</Title>

                            <FilterDropdown/>

                            <Content>
                                <CardContainer/>
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
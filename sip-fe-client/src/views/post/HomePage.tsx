import { Col, Divider, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import { Footer } from 'src/components/footer/Footer';
import { CardContainer } from 'src/modules/post/components/card/CardContainer';
import { FollowProductCardContainer } from 'src/modules/post/components/card/FollowProductCardContainer';
import { Container } from '../../components/container/Container';
import { ClientLayout } from '../../layouts/client/ClientLayout';

export function HomePage(): JSX.Element {
    return (
        <>
            <ClientLayout>
                <div className='py-10'>
                    <Container>
                        <Row>
                            <Col span={16}>
                                <Title level={2}>Let&#39;s get some idea 💩</Title>

                                <Content>
                                    <CardContainer/>
                                </Content>
                            </Col>

                            <Col span={1}>
                                <Divider type="vertical" style={{ height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.01)' }}/>
                            </Col>

                            <Col span={7}>
                                
                                <div>
                                    UPCOMING PRODUCTS
                                </div>

                                <FollowProductCardContainer/>

                                <Divider/>

                                <Footer />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ClientLayout>
        </>
    );
}
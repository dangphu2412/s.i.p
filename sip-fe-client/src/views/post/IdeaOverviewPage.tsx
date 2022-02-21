import { Col, Divider, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import { Footer } from 'src/components/footer/Footer';
import { IdeaContainer } from 'src/modules/post/components/card/IdeaContainer';
import { Container } from '../../components/container/Container';
import { ClientLayout } from '../../layouts/client/ClientLayout';

export function IdeaOverviewPage(): JSX.Element {
    return (
        <ClientLayout>
            <Container className='py-10'>
                <Row>
                    <Col span={16}>
                        <Title level={2}>Up coming products 💩</Title>

                        <Content>
                            <IdeaContainer/>
                        </Content>
                    </Col>

                    <Col span={1}>
                        <Divider type="vertical" style={{ height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.01)' }}/>
                    </Col>

                    <Col span={7}>
                        <Divider/>

                        <Footer />
                    </Col>
                </Row>
            </Container>
        </ClientLayout>
    );
}

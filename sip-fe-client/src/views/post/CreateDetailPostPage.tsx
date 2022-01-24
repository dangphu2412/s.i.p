import { Col, Divider, Menu, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './create-post-detail.scss';

interface MenuProps {
    key: string;
    title: string;
    icon: any;
}

export function CreateDetailPostPage() {
    const { slug } = useParams();
    const menuData: MenuProps[] = [
        {
            key: '1',
            title: 'Main info',
            icon: <FontAwesomeIcon icon='info-circle'/>
        },
        {
            key: '2',
            title: 'Media',
            icon: <FontAwesomeIcon icon='photo-video'/>
        },
        {
            key: '3',
            title: 'Sip-ers',
            icon: <FontAwesomeIcon icon='user'/>
        },
        {
            key: '4',
            title: 'Reviews and launch',
            icon: <FontAwesomeIcon icon='rocket'/>
        },
    ];

    const [data, setData] = useState({});
    
    return <ClientLayout>
        <div className='py-10'>
            <Container>
                {/* Header */}
                <div>
                    <Title level={4}>
                      Here is title
                    </Title>
                    <div>
                      Status: Dratf
                    </div>
                </div>

                <Divider />
                <Row>
                    <Col span={6} className='pr-5'>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            style={{ height: '100%' }}
                            onClick={e => console.log(e)}
                        >
                            {
                                menuData.map(item => {
                                    return <Menu.Item key={item.key}>
                                        <span className='mr-2'>
                                            {item.icon}
                                        </span>
                                        {item.title}
                                    </Menu.Item>;
                                })
                            }
                        </Menu>
                    </Col>

                    <Col span={18}>
                        <div>
                            <Title level={4}>
                                Tell us more about your product
                            </Title>
                            <div className='button-text-color'>
                                We’ll need its name, tagline, links, topics and description.
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    </ClientLayout>;
}

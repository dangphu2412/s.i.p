import { Button, Col, List, Row, Tabs } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';

enum ProfileTab {
    Idea = 'idea',
    Discussion = 'discussion',
}

interface ProfileTabProps {
    key: ProfileTab;
    content: string;
}

export function Profile(): JSX.Element {
    const tabs: ProfileTabProps[] = [
        {
            content: 'Idea',
            key: ProfileTab.Idea,
        },
        {
            content: 'Discussion',
            key: ProfileTab.Discussion,
        }
    ];

    const [activeKey, setActiveKey] = useState(ProfileTab.Idea);

    return <ClientLayout>
        <Container>
            <div className='mt-10'>
                <div
                    className='flex p-10 rounded-t'
                    style={{backgroundImage: 'linear-gradient(rgb(49, 27, 128) 0%, rgb(0, 51, 126) 100%)'}}
                >
                    <Avatar 
                        size={164}
                        src='https://joeschmoe.io/api/v1/random'
                        className='border-2 border-white'
                    />

                    <div  className='ml-5 content-color'>
                        <Title level={2} className='content-color'>
                            Phu Dang
                        </Title>
                        <div>
                            Some description about me
                        </div>
                        <div className='my-3'>
                            @dangphu2412
                        </div>
                        <Button ghost>
                            Edit profile
                        </Button>
                    </div>
                    
                </div>

                <div className='px-5'>
                    <Tabs 
                        size='large' 
                        activeKey={activeKey} 
                        onChange={key => setActiveKey(key as ProfileTab)}
                        className='pl-5'
                    >
                        {
                            tabs.map(tab => {
                                return <Tabs.TabPane
                                    className='text-lg'
                                    tab={tab.content}
                                    key={tab.key}
                                />;
                            })
                        }
                    
                    </Tabs>
                </div>
            </div>

            <Row>
                <Col span={16}>
                        Hello
                </Col>

                <Col span={8}>
                Hello

                </Col>
            </Row>
        </Container>
    </ClientLayout>;
}

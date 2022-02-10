import { FacebookFilled } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Divider, Row, Tabs } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { ProfileCardContainer } from 'src/modules/post/components/card/ProfileCardContainer';
import { Topic } from 'src/modules/topic/api/topic.api';


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

    const topics: Topic[] = [
        {
            id: '1',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            name: 'Topic 1',
            slug: 'topic-1',
            summary: 'Topic 1 summary',
        },
        {
            id: '2',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            name: 'Topic 2',
            slug: 'topic-2',
            summary: 'Topic 2 summary',
        }
    ];

    const { hashTag } = useParams();
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState<ProfileTab>(ProfileTab.Idea);
    

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
                        <Button ghost onClick={() => navigate('/settings')}>
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
                    {
                        activeKey === ProfileTab.Idea && <ProfileCardContainer hashTag={hashTag || ''}/>
                    }
                </Col>

                <Col span={8}>
                    <div className='shadow rounded-md content-bg p-5 hover:shadow-md transition delay-100'>
                        <div className='my-5'>
                            <FontAwesomeIcon
                                icon={'birthday-cake'}
                            />
                            <span className='ml-3 my-10'>
                                Joined on July 27th, 2020
                            </span>
                        </div>

                        <div className='my-5'>
                            <FontAwesomeIcon
                                icon={'star'}
                            />
                            <span className='ml-3 my-10'>
                                Followed Topics
                            </span>
                        </div>

                        <div className='flex space-x-2'>
                            {
                                topics.map(topic => {
                                    return <span key={topic.id}>
                                        <Link to={`/topics/${topic.slug}`}>
                                            {topic.name}
                                        </Link>
                                    </span>;
                                })
                            }
                        </div>

                        <Divider/>

                        <Button>
                            <FacebookFilled/> Share
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    </ClientLayout>;
}

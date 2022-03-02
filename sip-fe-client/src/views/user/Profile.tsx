import { FacebookFilled } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Divider, Row, Tabs } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import createDateFormatter from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { ProfileCardContainer } from 'src/modules/post/components/card/ProfileCardContainer';
import { ProfileDiscussionContainer } from 'src/modules/post/components/card/ProfileDiscussionContainer';
import { ProfileDetail } from 'src/modules/user/api/user.api';
import { UserActions } from 'src/modules/user/user.action';


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

    const { hashTag } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState<ProfileTab>(ProfileTab.Idea);
    const [profile, setProfile] = useState<ProfileDetail>({
        id: 'UNKNOWN',
        username: '',
        avatar: '',
        fullName: '',
        headline: '',
        hashTag: '',
        createdAt: new Date(),
        followedTopics: []
    });
    const profileDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_SIPER));
    if (!hashTag) {
        throw new Error('Missing hash tag when render profile page. Please check routing');
    }

    useEffect(() => {
        dispatch(UserActions.findSiper(hashTag));
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_SIPER));
        };
    }, []);

    useEffect(() => {
        if (profileDataHolder?.data) {
            setProfile(profileDataHolder.data);
        }
    }, [profileDataHolder]);

    return <ClientLayout>
        <Container>
            <div className='mt-10'>
                <div
                    className='flex p-10 rounded-t'
                    style={{backgroundImage: 'linear-gradient(rgb(49, 27, 128) 0%, rgb(0, 51, 126) 100%)'}}
                >
                    <Avatar
                        size={164}
                        src={profile.avatar}
                        className='border-2 border-white'
                    />

                    <div  className='ml-5 content-color'>
                        <Title level={2} className='content-color'>
                            {profile.fullName}
                        </Title>
                        <div>
                            {profile.headline}
                        </div>
                        <div className='my-3'>
                            {profile.hashTag}
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
                        activeKey === ProfileTab.Idea && <ProfileCardContainer hashTag={hashTag}/>
                    }
                    {
                        activeKey === ProfileTab.Discussion && <ProfileDiscussionContainer hashTag={hashTag}/>
                    }
                </Col>

                <Col span={8}>
                    <div className='shadow rounded-md content-bg p-5 hover:shadow-md transition delay-100'>
                        <div className='my-5'>
                            <FontAwesomeIcon
                                icon={'birthday-cake'}
                            />
                            <span className='ml-3 my-10'>
                                Joined on {createDateFormatter(profile.createdAt).format('MMDDYYYY')}
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
                                profile.followedTopics.length > 0
                                    ? profile.followedTopics.map(topic => {
                                        return <span key={topic.id}>
                                            <Link to={`/topics/${topic.slug}`}>
                                                {topic.name}
                                            </Link>
                                        </span>;
                                    })
                                    : 'You still not follow any topic'
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

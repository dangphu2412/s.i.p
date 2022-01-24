import {Avatar, Button, Col, Divider, Form, Input, List, Menu, Row} from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './create-post-detail.scss';
import { PatchPostDetail } from 'src/modules/post/api/post.api';

interface MenuProps {
    key: DetailMenu;
    title: string;
    icon: any;
}

enum DetailMenu {
    MAIN_INFO = 'MAIN_INFO',
    MEDIA = 'MEDIA',
    SIP_ERS = 'SIP_ERS',
    REVIEW_AND_LAUNCH = 'REVIEW_AND_LAUNCH'
}

export function CreateDetailPostPage() {
    const menuData: MenuProps[] = [
        {
            key: DetailMenu.MAIN_INFO,
            title: 'Main info',
            icon: <FontAwesomeIcon icon='info-circle'/>
        },
        {
            key: DetailMenu.MEDIA,
            title: 'Media',
            icon: <FontAwesomeIcon icon='photo-video'/>
        },
        {
            key: DetailMenu.SIP_ERS,
            title: 'Sip-ers',
            icon: <FontAwesomeIcon icon='user'/>
        },
        {
            key: DetailMenu.REVIEW_AND_LAUNCH,
            title: 'Reviews and launch',
            icon: <FontAwesomeIcon icon='rocket'/>
        },
    ];

    const { slug } = useParams();
    const [menuSelected, setMenuSelected] = useState<DetailMenu>(menuData[0].key);
    const [data, setData] = useState<PatchPostDetail>({
        name: '',
        tagLine: '',
        summary: '',
        links: {
            product: '',
            facebook: '',
        },
        topics: [
            {
                avatar: 'https://joeschmoe.io/api/v1/random',
                title: 'Web3'
            },
            {
                avatar: 'https://joeschmoe.io/api/v1/random',
                title: 'Hunter'
            }
        ],
        thumbnail: '',
        gallery: {
            video: '',
            images: '',
        },
        isHunter: true,
        sipers: [],
        pricingType: '',
        content: '',
        launchSchedule: new Date(),
    });

    function onTopicSearchEvent() {  return; }

    return <ClientLayout>
        <div className='py-10'>
            <Container>
                {/* Header */}
                <div>
                    <Title level={4}>
                        Here is title
                    </Title>
                    <div>
                        Status: Draft
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
                                    return <Menu.Item
                                        key={item.key}
                                        onClick={() => setMenuSelected(item.key)}
                                    >
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
                        {/*Main Info*/}
                        {
                            menuSelected === DetailMenu.MAIN_INFO &&
                            <Form
                                layout="vertical"
                                requiredMark={false}
                            >
                                <div>
                                    <Title level={4}>
                                        Tell us more about your product
                                    </Title>

                                    <div className='button-text-color'>
                                        We’ll need its name, tagline, links, topics and description.
                                    </div>

                                    <Form.Item label="Product name" required>
                                        <Input placeholder="Place your cool name here" />
                                    </Form.Item>

                                    <Form.Item label="Summary" required>
                                        <Input placeholder="Concise and descriptive for product" />
                                    </Form.Item>
                                </div>

                                <Divider />

                                <div>
                                    <Title level={4}>
                                        Links
                                    </Title>

                                    <Form.Item label="Product link" required>
                                        <Input disabled  placeholder="https://..." />
                                    </Form.Item>

                                    <Form.Item label="Facebook page" required>
                                        <Input addonBefore="https://facebook.com" placeholder='yourfacebook' />
                                    </Form.Item>
                                </div>

                                <Divider />

                                <div>
                                    <Title level={4}>
                                        Topics
                                    </Title>

                                    <Form.Item label="Select up to three topics" required>
                                        <Input.Search
                                            placeholder="Topic"
                                            onChange={onTopicSearchEvent}
                                        />
                                    </Form.Item>


                                    <List
                                        dataSource={data.topics}
                                        renderItem={item => {
                                            return <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar src={item.avatar} />}
                                                    title={item.title}
                                                />
                                                <FontAwesomeIcon
                                                    icon='minus-circle'
                                                    className='cursor-pointer'
                                                    onClick={e => alert('Remove')}
                                                />
                                            </List.Item>;
                                        }}
                                    />
                                </div>

                                <div>
                                    <Title level={4}>
                                        Description
                                    </Title>

                                    <Input.TextArea/>
                                </div>

                                <Button
                                    className='mt-5'
                                    onClick={() => setMenuSelected(DetailMenu.MEDIA)}
                                >
                                    Next step: Media
                                </Button>
                            </Form>
                        }

                        {
                            menuSelected === DetailMenu.MEDIA &&
                            <Form
                                layout="vertical"
                                requiredMark={false}
                            >
                                <div>
                                    <Title level={4}>
                                        Thumbnail
                                    </Title>

                                    <div className='button-text-color'>
                                        Pick a cool picture for your product
                                    </div>
                                </div>

                                <Divider />
                                <div>
                                    <Title level={4}>
                                        Gallery
                                    </Title>

                                    <div className='button-text-color'>
                                        The first image will be used as the social preview when your link is shared online.
                                        We recommend at least 3 or more images.
                                    </div>

                                </div>
                            </Form>
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    </ClientLayout>;
}

import {Avatar, Button, Col, Divider, Form, Input, List, Menu, Row, Upload} from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './create-post-detail.scss';
import { PatchPostDetail } from 'src/modules/post/api/post.api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { setLoading } from 'src/modules/loading/loading.action';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { useDispatch, useSelector } from 'react-redux';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { fetchPatchPostData } from 'src/modules/post/post.action';
import { setData } from 'src/modules/data/data.action';
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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { slug } = useParams();
    const [menuSelected, setMenuSelected] = useState<DetailMenu>(menuData[0].key);
    const [loading, setLoading] = useState<boolean>(false);
    const dataHolder = useSelector(selectDataHolderByView('PATCH_POST'));
    const [data, setData] = useState<PatchPostDetail>(dataHolder?.data ? dataHolder.data : {
        name: '',
        summary: '',
        description: '',
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
        galleryImages: '',
        runningStatus: '',
        socialPreviewImage: '',
        status : '',
        facebookLink: '',
        productLink: '',
        videoLink: '',
        isAuthorAlsoMaker: true,
        makers: [],
        pricingType: '',
        launchSchedule: new Date(),
    });

    useEffect(() => {
        if (!slug) {
            throw new Error('You must provide a slug in url');
        }
        dispatch(fetchPatchPostData({ slug }));
    }, []);

    function onTopicSearchEvent() {  return; }

    function beforeUpload() {  return; }

    function getBase64(img: RcFile, callback: (imageUrl: string) => void) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    }

    function handleUpload(info: UploadChangeParam<UploadFile<any>>) {  
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done' && info.file.originFileObj) {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (imageUrl: string) => {
                setData({
                    ...data,
                    thumbnail: imageUrl
                });
                setLoading(false);
            });
        }
    }

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
                            defaultSelectedKeys={[menuSelected]}
                            selectedKeys={[menuSelected]}
                            style={{ height: '100%' }}
                            onClick={e => {
                                setMenuSelected(e.key as DetailMenu);
                            }}
                        >
                            {
                                menuData.map(item => {
                                    return <Menu.Item
                                        key={item.key}
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

                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        beforeUpload={beforeUpload}
                                        onChange={handleUpload}
                                    >
                                        {
                                            data.thumbnail
                                                ? <img src={data.thumbnail} alt="avatar" style={{ width: '100%' }} />
                                                : <div>
                                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                        }
                                    </Upload>
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
                                    
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    >
                                        {
                                            data.thumbnail
                                                ? <img src={data.thumbnail} alt="avatar" style={{ width: '100%' }} />
                                                : <div>
                                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                        }
                                    </Upload>

                                </div>

                                <Divider />

                                <div>
                                    <Title level={4}>
                                        Youtube video
                                    </Title>
                                </div>

                                <div className='button-text-color'>
                                This is optional but we find that showing how your product works is helpful to convince people. If you do add a video, it will appear as the first item in your gallery when you launch.
                                </div>

                                <Form.Item label="Product video">
                                    <Input placeholder="Video of product" />
                                </Form.Item>

                                <Button
                                    className='mt-5'
                                    onClick={() => setMenuSelected(DetailMenu.SIP_ERS)}
                                >
                                    Next step: Sip-ers
                                </Button>
                            </Form>
                        }

                        {
                            menuSelected === DetailMenu.SIP_ERS &&
                            <Form
                                layout="vertical"
                                requiredMark={false}
                            >
                                <div>
                                    <Title level={4}>
                                        Did you work on this product?
                                    </Title>

                                    <div className='button-text-color'>
                                        It’s fine either way. Just need to know.
                                    </div>

                                    
                                </div>

                                <Divider />

                                <div>
                                    <Title level={4}>
                                    Who worked on this product?
                                    </Title>

                                    <div className='button-text-color'>
                                        You’re free to add anyone who worked on this product.
                                    </div>
                                </div>

                                <Divider />

                                <Button
                                    className='mt-5'
                                    onClick={() => setMenuSelected(DetailMenu.REVIEW_AND_LAUNCH)}
                                >
                                    Next step: Review and launch
                                </Button>
                            </Form>
                        }

                        {
                            menuSelected === DetailMenu.REVIEW_AND_LAUNCH &&
                            <Form
                                layout="vertical"
                                requiredMark={false}
                            >
                                <div>
                                    <Title level={4}>
                                        Required info
                                    </Title>

                                    <div className='button-text-color'>
                                        Check that you’ve completed all of the required information.
                                    </div>

                                    
                                </div>

                                <Divider />

                                <div>
                                    <Title level={4}>
                                        Suggested
                                    </Title>

                                    <div className='button-text-color'>
                                        Go the extra mile and add suggested information. Successful launches usually do.
                                    </div>
                                </div>

                                <Divider />

                                <Button
                                    className='mt-5'
                                    onClick={() => alert('Submitting product')}
                                >
                                    Launch now
                                </Button>

                                <Button
                                    className='mt-5'
                                    onClick={() => alert('Post this idea')}
                                >
                                    Post this idea
                                </Button>
                            </Form>
                        }


                    </Col>
                </Row>
            </Container>
        </div>
    </ClientLayout>;
}

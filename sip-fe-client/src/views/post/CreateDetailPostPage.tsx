import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, Col, Divider, Dropdown, Form, Image, Input, List, Menu, Radio, Row, Space, Upload } from 'antd';
import Title from 'antd/lib/typography/Title';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import { useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { selectProfile } from 'src/modules/auth/auth.selector';
import { Profile } from 'src/modules/auth/auth.service';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { PatchPostDetail } from 'src/modules/post/api/post.api';
import { PostActions } from 'src/modules/post/post.action';
import { Topic } from 'src/modules/topic/api/topic.api';
import { TopicActions } from 'src/modules/topic/topic.action';
import { Author } from 'src/modules/user/api/user.api';
import { UserActions } from 'src/modules/user/user.action';
import { ArrayUtils } from 'src/utils/array.utils';
import './create-post-detail.scss';


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

    const { slug } = useParams();
    const [selectedMenu, setSelectedMenu] = useState<DetailMenu>(menuData[0].key);
    const [loading, setLoading] = useState<boolean>(false);

    const profile: Profile | undefined = useSelector(selectProfile);
    const postDetailDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.POST_PATCH_DETAIL));
    const [data, setData] = useState<PatchPostDetail>({
        id: 'UNKNOWN',
        title: '',
        summary: '',
        description: '',
        topics: [],
        thumbnail: '',
        galleryImages: [],
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
    const [authorAlsoMaker, setAuthorAlsoMaker] = useState<1 | 2>(data.isAuthorAlsoMaker ? 1 : 2);

    const [galleryImages, setGalleryImages] = useState<UploadFile<any>[]>([]);

    const searchTopicDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.SEARCH_TOPIC));
    const [searchTopics, setSearchTopics] = useState<Topic[]>(searchTopicDataHolder?.data
        ? searchTopicDataHolder.data
        : []);
    const [topicSearch, setTopicSearch] = useState('');

    const searchMakerDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.SEARCH_MAKERS));
    const [makers, setMakers] = useState<Author[]>(searchMakerDataHolder?.data
        ? searchMakerDataHolder.data
        : []);
    const [makerSearch, setMakerSearch] = useState('');

    useEffect(() => {
        if (!slug) {
            throw new Error('You must provide a slug in url');
        }
        dispatch(PostActions.getPatchData({ slug }));
    }, []);

    useEffect(() => {
        if (data.id !== 'UNKNOWN') {
            dispatch(PostActions.saveData(data));
        }
    } , [data]);

    useEffect(() => {
        if (searchTopicDataHolder?.data) {
            setSearchTopics(searchTopicDataHolder.data);
        }
    }, [searchTopicDataHolder]);

    useEffect(() => {
        if (searchMakerDataHolder?.data) {
            setMakers(searchMakerDataHolder.data);
        }
    }, [searchMakerDataHolder]);

    useEffect(() => {
        if (postDetailDataHolder?.data) {
            setData(postDetailDataHolder.data);
            setAuthorAlsoMaker(postDetailDataHolder.data.isAuthorAlsoMaker ? 1 : 2);
            setGalleryImages((postDetailDataHolder.data as PatchPostDetail)
                .galleryImages.map((image, index) => {
                    return {
                        uid: `${index}`,
                        name: 'image.png',
                        status: 'done',
                        url: image,
                    } as UploadFile<any>;
                }));
        }
    }, [postDetailDataHolder]);

    function onTopicSearchEvent(event: React.ChangeEvent<HTMLInputElement>) {
        setTopicSearch(event.target.value);
        if (event.target.value) {
            dispatch(TopicActions.findMany({
                filters: [],
                sorts: [],
                page: {
                    page: 0,
                    size: 3
                },
                search: event.target.value
            }));
        }
    }

    function onMakerSearchEvent(event: React.ChangeEvent<HTMLInputElement>) {
        setMakerSearch(event.target.value);
        if (event.target.value) {
            dispatch(UserActions.findMakers({
                filters: [],
                sorts: [],
                page: {
                    page: 0,
                    size: 5
                },
                search: event.target.value
            }));
        }
    }

    function updateData(key: string, value: any) {
        setData({
            ...data,
            [key]: value
        });
    }

    function handleUploadThumbnail(info: UploadChangeParam<UploadFile<any>>) {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done' && info.file.originFileObj) {
            if (info.file.response) {
                setData({
                    ...data,
                    thumbnail: info.file.response.data[0]
                });
                setLoading(false);
            }
        }
    }

    function handleGalleryUpload(info: UploadChangeParam<UploadFile<any>>) {
        setGalleryImages(info.fileList);

        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done' && info.file) {
            if (info.file.response) {
                const newGalleryImages = [...data.galleryImages, info.file.response.data[0]];
                setData({
                    ...data,
                    galleryImages: newGalleryImages,
                    socialPreviewImage: newGalleryImages[0]
                });
                setLoading(false);
            }
        }
    }

    return <ClientLayout>
        <div className='py-10'>
            <Container>
                {/* Header */}
                <div>
                    <Title level={4}>
                        {
                            data.title
                        }
                    </Title>
                    <div>
                        Status: { data.status }
                    </div>
                    <div>
                        Running Status: { data.runningStatus }
                    </div>
                </div>

                <Divider />

                <Row>
                    <Col span={6} className='pr-5'>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[selectedMenu]}
                            selectedKeys={[selectedMenu]}
                            style={{ height: '100%' }}
                            onClick={e => {
                                setSelectedMenu(e.key as DetailMenu);
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
                        <Form
                            layout="vertical"
                            requiredMark={false}
                        >
                            {
                                selectedMenu === DetailMenu.MAIN_INFO &&
                                <div>
                                    <div>
                                        <Title level={4}>
                                            Tell us more about your product
                                        </Title>

                                        <div className='button-text-color'>
                                            We’ll need its name, tagline, links, topics and description.
                                        </div>

                                        <Form.Item label="Product name" required>
                                            <Input 
                                                placeholder="Place your cool name here"
                                                value={data.title}
                                                onChange={e => updateData('title', e.target.value)}
                                            />
                                        </Form.Item>

                                        <Form.Item label="Summary" required>
                                            <Input
                                                placeholder="Concise and descriptive for product"
                                                value={data.summary}
                                                onChange={e => updateData('summary', e.target.value)}
                                            />
                                        </Form.Item>
                                    </div>

                                    <Divider />

                                    <div>
                                        <Title level={4}>
                                            Links
                                        </Title>

                                        <Form.Item label="Product link" required>
                                            <Input
                                                placeholder="https://..."
                                                value={data.productLink}
                                                onChange={e => {
                                                    const productLink = e.target.value;
                                                    if (!!productLink && data.runningStatus === 'STILL_IDEA') {
                                                        if (!ArrayUtils.isEmpty(data.makers)) {
                                                            updateData('runningStatus', 'UP_COMING');
                                                        }
                                                    }
                                                    updateData('productLink', productLink);
                                                }}
                                            />
                                        </Form.Item>

                                        <Form.Item label="Facebook page" required>
                                            <Input
                                                addonBefore="https://facebook.com"
                                                placeholder='yourfacebook'
                                                value={data.facebookLink}
                                                onChange={e => updateData('facebookLink', e.target.value)}
                                            />
                                        </Form.Item>
                                    </div>

                                    <Divider />

                                    <div>
                                        <Title level={4}>
                                            Topics
                                        </Title>

                                        <Form.Item label="Select up to three topics" required>
                                            <Dropdown
                                                overlay={() => ((
                                                    <Menu>
                                                        {
                                                            searchTopics.length > 0  &&
                                                            searchTopics.map(topic => {
                                                                return (
                                                                    <Menu.Item
                                                                        key={topic.id}
                                                                        onClick={() => {
                                                                            updateData('topics', [...data.topics, topic]);
                                                                        }}
                                                                    >
                                                                        {
                                                                            topic.name
                                                                        }
                                                                    </Menu.Item>
                                                                );
                                                            })
                                                        }
                                                    </Menu>
                                                ))}
                                                visible={searchTopics.length > 0 && !!topicSearch}
                                            >
                                                <Input.Search
                                                    placeholder="Topic"
                                                    onChange={onTopicSearchEvent}
                                                    value={topicSearch}
                                                />
                                            </Dropdown>
                                        </Form.Item>

                                        {/* List selected */}
                                        {
                                            data.topics.length > 0 && 
                                            <List
                                                dataSource={data.topics}
                                                renderItem={item => {
                                                    return <List.Item
                                                        key={item.id}
                                                        onClick={() => {
                                                            updateData('topics', data.topics.filter(topic => topic.id !== item.id));
                                                        }}
                                                    >
                                                        <List.Item.Meta
                                                            avatar={<Avatar src={item.avatar} />}
                                                            title={item.name}
                                                        />
                                                        <FontAwesomeIcon
                                                            icon='minus-circle'
                                                            className='cursor-pointer'
                                                        />
                                                    </List.Item>;
                                                }}
                                            />
                                        }
                                    </div>

                                    <div>
                                        <Title level={4}>
                                            Description
                                        </Title>

                                        <Input.TextArea
                                            value={data.description}
                                            onChange={e => updateData('description', e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        className='mt-5'
                                        onClick={() => setSelectedMenu(DetailMenu.MEDIA)}
                                    >
                                        Next step: Media
                                    </Button>
                                </div>
                            }

                            {
                                selectedMenu === DetailMenu.MEDIA &&
                                <div>
                                    <div>
                                        <Title level={4}>
                                            Thumbnail
                                        </Title>

                                        <div className='button-text-color'>
                                            Pick a cool picture for your product
                                        </div>

                                        <Upload
                                            name="files"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="http://localhost:3000/v1/media/upload"
                                            onChange={handleUploadThumbnail}
                                        >
                                            {
                                                data.thumbnail
                                                    ? <Image
                                                        src={data.thumbnail}
                                                        alt="thumbnail"
                                                        preview={false}
                                                    />
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

                                        {
                                            data.socialPreviewImage
                                            && 
                                            <Image
                                                src={data.socialPreviewImage}
                                                alt='Preview image'
                                                preview={false}
                                            />
                                        }
                                            
                                        <Upload
                                            name="files"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            action="http://localhost:3000/v1/media/upload"
                                            onChange={handleGalleryUpload}
                                            fileList={galleryImages}
                                        >
                                            {
                                                <span>
                                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                    <span style={{ marginTop: 8 }}>Upload</span>
                                                </span>
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
                                        <Input
                                            placeholder="Video of product" 
                                            value={data.videoLink}
                                            onChange={e => updateData('videoLink', e.target.value)}
                                        />
                                    </Form.Item>

                                    <Button
                                        className='mt-5'
                                        onClick={() => setSelectedMenu(DetailMenu.SIP_ERS)}
                                    >
                                        Next step: Sip-ers
                                    </Button>
                                </div>
                            }

                            {
                                selectedMenu === DetailMenu.SIP_ERS &&
                                <div>
                                    <div>
                                        <Title level={4}>
                                            Did you work on this product?
                                        </Title>

                                        <div className='button-text-color'>
                                            It’s fine either way. Just need to know.
                                        </div>

                                        <Radio.Group
                                            onChange={(e) => {
                                                setAuthorAlsoMaker(e.target.value);
                                                if (!profile) {
                                                    throw new Error('Profile is not set');
                                                }
                                                if (e.target.value === 1) {
                                                    setData({
                                                        ...data,
                                                        isAuthorAlsoMaker: !data.isAuthorAlsoMaker,
                                                        makers: [...data.makers, {
                                                            id: profile.id,
                                                            fullName: profile.fullName,
                                                            avatar: profile.avatar,
                                                        } as Author]
                                                    });
                                                } else {
                                                    setData({
                                                        ...data,
                                                        isAuthorAlsoMaker: !data.isAuthorAlsoMaker,
                                                        makers:  [...data.makers.filter(maker => maker.id !== profile.id)]
                                                    });
                                                }
                                                
                                            }}
                                            value={authorAlsoMaker}
                                        >
                                            <Space direction="vertical">
                                                <Radio value={1}>I worked on this product</Radio>
                                                <Radio value={2}>I didn’t work on this product</Radio>
                                            </Space>
                                        </Radio.Group>

                                        
                                    </div>

                                    <Divider />

                                    <div>
                                        <Title level={4}>
                                        Who worked on this product?
                                        </Title>

                                        <div className='button-text-color'>
                                            You’re free to add anyone who worked on this product.
                                        </div>

                                        <Form.Item label="Search full name or gmail ..." required>
                                            <Dropdown
                                                overlay={() => (
                                                    <Menu>
                                                        {
                                                            makers.length > 0  &&
                                                            makers.map(maker => {
                                                                return (
                                                                    <Menu.Item
                                                                        key={maker.id}
                                                                        onClick={() => { updateData('makers', [...data.makers, maker]);}}
                                                                    >
                                                                        {
                                                                            maker.fullName
                                                                        }
                                                                        <FontAwesomeIcon
                                                                            icon='plus-circle'
                                                                        />
                                                                    </Menu.Item>
                                                                );
                                                            })
                                                        }
                                                    </Menu>
                                                )}
                                                visible={makers.length > 0 && !!makerSearch}
                                            >
                                                <Input.Search
                                                    placeholder="Makers"
                                                    onChange={onMakerSearchEvent}
                                                    value={makerSearch}
                                                />
                                            </Dropdown>

                                            {
                                                data.makers.length > 0 && 
                                                <List
                                                    dataSource={data.makers}
                                                    renderItem={item => {
                                                        return <List.Item
                                                            key={item.id}
                                                            onClick={() => {
                                                                if (!profile) {
                                                                    throw new Error('Profile is not set');
                                                                }
                                                                const newMakers = data.makers.filter(maker => maker.id !== item.id);
                                                                if (item.id === profile.id) {
                                                                    setAuthorAlsoMaker(2);
                                                                    setData({
                                                                        ...data,
                                                                        makers: newMakers,
                                                                        isAuthorAlsoMaker: false
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            <List.Item.Meta
                                                                avatar={<Avatar src={item.avatar} />}
                                                                title={item.fullName}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon='minus-circle'
                                                                className='cursor-pointer'
                                                            />
                                                        </List.Item>;
                                                    }}
                                                />
                                            }
                                        </Form.Item>
                                    </div>

                                    <Divider />

                                    <Button
                                        className='mt-5'
                                        onClick={() => setSelectedMenu(DetailMenu.REVIEW_AND_LAUNCH)}
                                    >
                                        Next step: Review and launch
                                    </Button>
                                </div>
                            }

                            {
                                selectedMenu === DetailMenu.REVIEW_AND_LAUNCH &&
                                <div>
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
                                </div>
                            }
                        </Form>


                    </Col>
                </Row>
            </Container>
        </div>
    </ClientLayout>;
}

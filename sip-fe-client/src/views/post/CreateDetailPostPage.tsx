import { ExclamationCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Avatar, Button, Checkbox, Col, Divider, Dropdown, Form, Image, DatePicker,
    Input, List, Menu, Modal, Radio, RadioChangeEvent, Row, Space, Steps, Upload
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import dayFormatter from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { selectProfile } from 'src/modules/auth/auth.selector';
import { Profile } from 'src/modules/auth/auth.service';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { PatchPostDetail } from 'src/modules/post/api/post.api';
import { PostStatus, PricingType, ProductRunningStatus } from 'src/modules/post/constants/post-status.enum';
import { PostActions } from 'src/modules/post/post.action';
import { getUploadUrl } from 'src/modules/post/post.service';
import { Topic } from 'src/modules/topic/api/topic.api';
import { TopicActions } from 'src/modules/topic/topic.action';
import { Author } from 'src/modules/user/api/user.api';
import { UserActions } from 'src/modules/user/user.action';
import { ArrayUtils } from 'src/utils/array.utils';
import './create-post-detail.scss';

interface MenuProps {
    key: DetailMenu;
    title: string;
    icon: JSX.Element;
}

interface ProductPlan {
    key: ProductRunningStatus;
    title: string;
    description: string;
    detail: string;
}

enum DetailMenu {
    MAIN_INFO = 'MAIN_INFO',
    MEDIA = 'MEDIA',
    SIP_ERS = 'SIP_ERS',
    EXTRAS = 'EXTRAS',
    REVIEW_AND_LAUNCH = 'REVIEW_AND_LAUNCH'
}

export function CreateDetailPostPage(): JSX.Element {
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
            key: DetailMenu.EXTRAS,
            title: 'Extras',
            icon: <FontAwesomeIcon icon='fire'/>
        },
        {
            key: DetailMenu.REVIEW_AND_LAUNCH,
            title: 'Reviews and launch',
            icon: <FontAwesomeIcon icon='rocket'/>
        },
    ];

    const productRunningPlans: ProductPlan[] = [
        {
            key: ProductRunningStatus.IDEA,
            title: 'Idea phase',
            description: 'This is still an idea',
            detail: 'This is still an idea phase. You need to add product link to get started looking for members.'
        },
        {
            key: ProductRunningStatus.LOOKING_FOR_MEMBERS,
            title: 'Looking for makers',
            description: 'You are looking for makers to make your idea come true',
            detail: 'Oh now you are looking for makers. Wait for them to join your project. You can add them to your project in Sip-ers Tab.'
        },
        {
            key: ProductRunningStatus.PRE_RELEASED,
            title: 'Before released',
            description: 'Your product is ready for the community to use',
            detail: 'Your product is about to release. You can share it with your friends and family.'
        },
        {
            key: ProductRunningStatus.RELEASED,
            title: 'Released',
            description: 'Your product is ready for the community to use',
            detail: 'Your product is running now. You can share it with your friends and family.'
        }
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { slug } = useParams();
    const [selectedMenu, setSelectedMenu] = useState<DetailMenu>(menuData[0].key);
    const [loading, setLoading] = useState<boolean>(false);

    const profile: Profile | undefined = useSelector(selectProfile);
    const postDetailDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_POST_PATCH_DETAIL));
    const [data, setData] = useState<PatchPostDetail>({
        id: 'UNKNOWN',
        title: '',
        summary: '',
        description: '',
        topics: [],
        thumbnail: '',
        galleryImages: [],
        runningStatus: ProductRunningStatus.IDEA,
        socialPreviewImage: '',
        status : PostStatus.DRAFT,
        facebookLink: '',
        productLink: '',
        videoLink: '',
        isAuthorAlsoMaker: true,
        makers: [],
        pricingType: PricingType.FREE,
        launchSchedule: null,
        firstComment: ''
    });

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

    const [galleryImages, setGalleryImages] = useState<UploadFile[]>([]);
    const [runningStatus, setRunningStatus] = useState(0);

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
            const runningStatus = getCurrentRunningStatus((postDetailDataHolder.data as PatchPostDetail).runningStatus);
            if (runningStatus === -1) {
                throw new Error('Invalid running status');
            }
            setData(postDetailDataHolder.data);
            setGalleryImages((postDetailDataHolder.data as PatchPostDetail)
                .galleryImages.map((image, index) => {
                    return {
                        uid: `${index}`,
                        name: 'image.png',
                        status: 'done',
                        url: image,
                    } as UploadFile;
                }));
            setRunningStatus(runningStatus);
        }
    }, [postDetailDataHolder]);

    function onTopicSearchEvent(event: React.ChangeEvent<HTMLInputElement>) {
        setTopicSearch(event.target.value);
        if (event.target.value) {
            dispatch(TopicActions.getMany({
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

    function onHandleAuthorAsMaker(event: RadioChangeEvent) {
        if (!profile) {
            throw new Error('Profile is not set');
        }
        if (event.target.value) {
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
    }

    function onProductLinkChange(event: React.ChangeEvent<HTMLInputElement>) {
        const productLink = event.target.value;
        if (!productLink) {
            setData({
                ...data,
                runningStatus: ProductRunningStatus.IDEA,
                productLink
            });
            return;
        }
        if (data.runningStatus === ProductRunningStatus.IDEA) {
            if (ArrayUtils.isPresent(data.makers)) {
                setData({
                    ...data,
                    runningStatus: ProductRunningStatus.LOOKING_FOR_MEMBERS,
                    productLink
                });
                return;
            }

            setData({
                ...data,
                runningStatus: ProductRunningStatus.LOOKING_FOR_MEMBERS,
                productLink
            });
            setRunningStatus(getCurrentRunningStatus(ProductRunningStatus.LOOKING_FOR_MEMBERS));
        }
    }

    function updateData<T>(key: string, value: T) {
        setData({
            ...data,
            [key]: value
        });
    }

    function handleUploadThumbnail(info: UploadChangeParam<UploadFile>) {
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

    function handleGalleryUpload(info: UploadChangeParam<UploadFile>) {
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

    function handleGalleryRemoval(file: UploadFile) {
        setGalleryImages(galleryImages.filter(image => image.uid !== file.uid));
        const newGalleryImages = data.galleryImages.filter(image => image !== file.url);
        setData({
            ...data,
            galleryImages: newGalleryImages,
            socialPreviewImage: newGalleryImages[0] || ''
        });
    }

    function handleMakerRemoval(author: Author) {
        if (!profile) {
            throw new Error('Profile is not set');
        }
        const newMakers = data.makers.filter(maker => maker.id !== author.id);
        if (author.id === profile.id) {
            setData({
                ...data,
                makers: newMakers,
                isAuthorAlsoMaker: false
            });
        }
    }

    function showPublishConfirmation() {
        Modal.confirm({
            title: 'Do you want to publish this product?',
            icon: <ExclamationCircleOutlined />,
            content: 'You are about to publish this product. Once published, it will be visible to all users.',
            onOk() {
                dispatch(PostActions.saveData({
                    ...data,
                    status: PostStatus.PUBLISH
                }));
                navigate('/');
            }
        });
    }

    function showScheduleModal() {
        Modal.confirm({
            title: 'Schedule this product to launch?',
            icon: <ExclamationCircleOutlined />,
            content: <>
                <p>
                    You are about to schedule this product to launch.
                </p>
                <DatePicker
                    value={dayFormatter(data.launchSchedule)}
                    onChange={e => {
                        if (e) {
                            updateData('launchSchedule', e.toDate());
                        }
                    }}/>
            </>
        });
    }

    function getCurrentRunningStatus(status: ProductRunningStatus): number {
        return productRunningPlans.findIndex(plan => plan.key === status);
    }

    return <ClientLayout>
        <div className='py-10'>
            <Container>
                {/* Header */}
                <div className='flex justify-between'>
                    <div>
                        <Title level={3}>
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

                    <div>
                        <div>
                            Auto saved few minutes ago
                        </div>
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

                    <Col span={18} className='pl-10'>
                        {/*Main Info*/}
                        <Form
                            layout="vertical"
                            requiredMark={false}
                        >
                            {
                                selectedMenu === DetailMenu.MAIN_INFO &&
                                <div>
                                    <div>
                                        <Title level={3}>
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
                                        <Title level={3}>
                                            Links
                                        </Title>

                                        <Form.Item label="Product link" required>
                                            <Input
                                                placeholder="https://..."
                                                value={data.productLink}
                                                onChange={onProductLinkChange}
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
                                        <Title level={3}>
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
                                                                            setTopicSearch('');
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
                                        <Title level={3}>
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
                                        <Title level={3}>
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
                                            action={getUploadUrl()}
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
                                        <Title level={3}>
                                            Gallery
                                        </Title>

                                        <div className='button-text-color'>
                                            The first image will be used as the social preview when your link is shared online.
                                            We recommend at least 3 or more images.
                                        </div>

                                        {
                                            data.socialPreviewImage
                                            &&
                                            <div className='my-5'>
                                                <Image
                                                    src={data.socialPreviewImage}
                                                    alt='Preview image'
                                                    preview={false}
                                                />
                                            </div>

                                        }

                                        <Upload
                                            name="files"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            action={getUploadUrl()}
                                            fileList={galleryImages}
                                            onChange={handleGalleryUpload}
                                            onRemove={handleGalleryRemoval}
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
                                        <Title level={3}>
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
                                        <Title level={3}>
                                            Did you work on this product?
                                        </Title>

                                        <div className='button-text-color'>
                                            It’s fine either way. Just need to know.
                                        </div>

                                        <Radio.Group
                                            onChange={onHandleAuthorAsMaker}
                                            value={data.isAuthorAlsoMaker}
                                        >
                                            <Space direction="vertical">
                                                <Radio value={true}>I worked on this product</Radio>
                                                <Radio value={false}>I didn’t work on this product</Radio>
                                            </Space>
                                        </Radio.Group>


                                    </div>

                                    <Divider />

                                    <div>
                                        <Title level={3}>
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
                                                                        onClick={() => {
                                                                            const newMakers = [...data.makers, maker];
                                                                            setMakerSearch('');
                                                                            updateData('makers', newMakers);
                                                                        }}
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
                                                            onClick={() => handleMakerRemoval(item)}
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
                                        onClick={() => setSelectedMenu(DetailMenu.EXTRAS)}
                                    >
                                        Next step: Extra things
                                    </Button>
                                </div>
                            }

                            {
                                selectedMenu === DetailMenu.EXTRAS &&
                                <div>
                                    <div>
                                        <Title level={3}>
                                            Pricing
                                        </Title>

                                        <div className='button-text-color mb-5'>
                                            Optional, but the community really appreciates knowing.
                                        </div>

                                        <Radio.Group
                                            onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    pricingType: e.target.value
                                                });
                                            }}
                                            value={data.pricingType}
                                        >
                                            <Space direction="vertical">
                                                <Radio value={PricingType.FREE}>Free</Radio>
                                                <Radio value={PricingType.PAID}>Paid</Radio>
                                                <Radio value={PricingType.PAID_WITH_FREE_PLANS}>Paid (with a free trial or plan)</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </div>

                                    <Divider />

                                    <div>
                                        <Title level={3}>
                                            Write your first comment
                                        </Title>

                                        <div className='button-text-color mb-5'>
                                            This comment will be posted when your product launches. Adding a first comment is essential to get the discussion started.
                                        </div>

                                        <TextArea
                                            value={'Hello, I am using this product. I hope you enjoy it!'}
                                            placeholder='Explain how you discovered this product.. Invite people to join the conversation!'
                                        />
                                    </div>

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
                                        <Title level={3}>
                                            Required info
                                        </Title>

                                        <div className='button-text-color'>
                                            Check that you’ve completed all of the required information.
                                        </div>

                                        <Row className='mt-5'>
                                            <Col span={12}>
                                                <div
                                                    className='my-2 cursor-pointer'
                                                    onClick={() => setSelectedMenu(DetailMenu.MAIN_INFO)}
                                                >
                                                    <Checkbox checked={!!data.title}/> Product name
                                                </div>

                                                <div
                                                    className='my-2 cursor-pointer'
                                                    onClick={() => setSelectedMenu(DetailMenu.MAIN_INFO)}
                                                >
                                                    <Checkbox checked={!!data.summary}/> Product summary
                                                </div>

                                                <div
                                                    className='my-2 cursor-pointer'
                                                    onClick={() => setSelectedMenu(DetailMenu.MAIN_INFO)}
                                                >
                                                    <Checkbox checked={!!data.description}/> Description
                                                </div>

                                            </Col>

                                            <Col span={12}>
                                                <div
                                                    className='my-2 cursor-pointer'
                                                    onClick={() => setSelectedMenu(DetailMenu.MEDIA)}
                                                >
                                                    <Checkbox checked={!!data.thumbnail}/> Thumbnail
                                                </div>

                                                <div
                                                    className='my-2 cursor-pointer'
                                                    onClick={() => setSelectedMenu(DetailMenu.MEDIA)}
                                                >
                                                    <Checkbox checked={!!data.galleryImages?.length}/> Add images to gallery
                                                </div>
                                            </Col>
                                        </Row>


                                    </div>

                                    <Divider />

                                    <div>
                                        <Title level={3}>
                                            Suggested
                                        </Title>

                                        <div className='button-text-color'>
                                            Go the extra mile and add suggested information. Successful launches usually do.
                                        </div>

                                        <div className='mt-5'>
                                            <div
                                                className='my-2 cursor-pointer'
                                                onClick={() => setSelectedMenu(DetailMenu.MAIN_INFO)}
                                            >
                                                <Checkbox checked={!!data.videoLink && !!data.facebookLink}/> Links
                                            </div>

                                            <div
                                                className='my-2 cursor-pointer'
                                                onClick={() => setSelectedMenu(DetailMenu.SIP_ERS)}
                                            >
                                                <Checkbox checked={!!data.isAuthorAlsoMaker}/> Did you work on this product?
                                            </div>
                                        </div>
                                    </div>

                                    <Divider />

                                    <div>
                                        <Title level={3}>
                                            Running plan
                                        </Title>

                                        <div className='button-text-color mb-5'>
                                            {
                                                productRunningPlans[runningStatus].detail
                                            }
                                        </div>
                                        <Steps current={runningStatus}>
                                            {
                                                productRunningPlans.map(plan => {
                                                    return (
                                                        <Steps.Step
                                                            key={plan.key}
                                                            title={plan.title}
                                                            description={plan.description}
                                                        />
                                                    );
                                                })
                                            }
                                        </Steps>
                                    </div>

                                    <Divider />

                                    <Button
                                        className='mt-5'
                                        onClick={() => showPublishConfirmation()}
                                        disabled={!data.title || !data.summary || !data.description || !data.thumbnail || !data.socialPreviewImage || data.galleryImages.length === 0}
                                    >
                                        Launch now
                                    </Button>

                                    <Button
                                        className='mt-5'
                                        onClick={() => showScheduleModal()}
                                        disabled={!data.title || !data.summary || !data.description || !data.thumbnail || !data.socialPreviewImage || data.galleryImages.length === 0 || data.makers.length === 0 || (data.makers.length === 1 && data.isAuthorAlsoMaker)}
                                    >
                                        Schedule launch later
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

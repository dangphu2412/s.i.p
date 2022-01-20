import './post-detail.scss';
import { Button, Col, Divider, Image, Row, Comment, Avatar } from 'antd';
import Title from 'antd/lib/typography/Title';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { TopFeatureBadge } from 'src/modules/post/components/badge/TopFeatureBadge';
import { fetchPostDetail } from 'src/modules/post/post.action';
import { PostDetail, ProjectMembers } from '../../modules/post/api/post.api';
import { ArrayUtils } from 'src/utils/array.utils';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { DiscussionEditor } from 'src/modules/discussion/components/Editor.component';
import { FacebookFilled, GithubFilled } from '@ant-design/icons';
import { SimpleCard } from '../../components/card/SimpleCard';
const contentStyle: React.CSSProperties = {
    color: '#fff',
    textAlign: 'center',
    background: '#364d79',
};

interface GalleryItem {
    type: 'image' | 'video',
    src: string;
}

const data: PostDetail = {
    id: '2',
    author: {avatar: '', fullName: 'Fus dep trai', id: '1'},
    content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam corrupti adipisci distinctio esse pariatur amet vitae suscipit in nihil enim. Laudantium rerum quos dolorum repellat maiores et fugiat, veniam ex.',
    isVoted: true,
    galleryImages: ['https://joeschmoe.io/api/v1/random', 'https://joeschmoe.io/api/v1/random'],
    previewGalleryImg: 'https://joeschmoe.io/api/v1/randomv',
    productLink: '',
    slug: '',
    summary: 'This is short summary about this topic',
    thumbnail: 'https://joeschmoe.io/api/v1/random',
    title: 'This is the hottest one',
    topics: [{id: '1', name: 'Tech', slug: 'Tech'}],
    totalVotes: 10,
    videoDemo: 'https://www.youtube.com/embed/0ENKBcckukM',
    ranking: '1',
};

const makers = [
    {
        id: '1',
        avatar: 'https://joeschmoe.io/api/v1/random',
        name: 'Fus dep trai',
        position: 'Marketer'
    },
    {
        id: '2',
        avatar: 'https://joeschmoe.io/api/v1/random',
        name: 'Fus suck trai',
        position: 'DevOps'
    },
    {
        id: '3',
        avatar: 'https://joeschmoe.io/api/v1/random',
        name: 'Fus suck trai',
        position: 'Super backend'
    }
];

const projectMembers: ProjectMembers = {
    hunter: {
        id: '1',
        avatar: 'https://joeschmoe.io/api/v1/random',
        name: 'Fus dep trai',
        position: 'Marketer'
    },
    makers
};

export function PostDetailPage(): JSX.Element {
    const dispatch = useDispatch();
    const { postId } = useParams();
    const [postDetail, setPostDetail] = useState<PostDetail | undefined>(data);
    const dataHolder = useSelector(selectDataHolderByView('POST_DETAIL'));

    if (!postId) {
        throw new Error('Please recheck your routing. Post detail view is missing postId with key: postId');
    }
    
    // useEffect(() => {
    //     if (!dataHolder) {
    //         dispatch(fetchPostDetail({ postId }));
    //     }
    // }, [dataHolder]);

    // if (dataHolder?.data) {
    //     setPostDetail(postDetail);
    // }

    function toGallery(imgs: string[] | undefined, videoLink: string | undefined): GalleryItem[] {
        const gallery: GalleryItem[] = [];
        if (!ArrayUtils.isEmpty(imgs)) {
            imgs.forEach(img => {
                gallery.push({
                    src: img,
                    type: 'image'
                });
            });
        }

        if (videoLink) {
            gallery.push({
                src: videoLink,
                type: 'video'
            });
        }

        return gallery;
    }

    return (
        <ClientLayout>
            <Container>
                {/* Heading data */}
                <Row>
                    {/* Thumbnail of product */}
                    <Col span={3}>
                        <Image
                            src="https://joeschmoe.io/api/v1/random"
                            style={{ width: 100, height: 100 }}
                            preview={false}
                        />
                    </Col>
                    {/* Product introduction */}
                    <Col span={13}>
                        <Title level={4}>
                            {postDetail?.title}
                        </Title>
                        <div>{postDetail?.summary}</div>
                        {postDetail?.topics.map(topic => {
                            return (<span key={topic.id}>
                                {topic.name}
                            </span>);
                        })}
                    </Col>

                    {/* Ranking */}
                    <Col span={8}>
                        {
                            postDetail?.ranking === '1' &&
                            <TopFeatureBadge
                                rankTitle='#1 Product of the day'
                                dateRank={Date.now()}
                            />
                        }
                    </Col>
                </Row>

                {/* Main content */}
                <Row>
                    {/* Gallery & detail and discussion */}
                    <Col span={16}>
                        <Carousel 
                            showThumbs={true}
                            showArrows={true}
                            showStatus={false}
                            showIndicators={false}
                            renderThumbs={children => {
                                return children.map(i => {
                                    return (<img key={i.toString()} src="https://joeschmoe.io/api/v1/random"/>);
                                });
                            }}
                        >
                            {
                                toGallery(postDetail?.galleryImages, postDetail?.videoDemo)
                                    .map((item, index) => {
                                        if (item.type === 'image') {
                                            return (
                                                <Image
                                                    key={index}
                                                    src="https://ph-files.imgix.net/02eab590-4b2e-46a0-8eb8-2ec59cc51d2f.png?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=640&h=380&fit=max&bg=0fff"
                                                    style={contentStyle}
                                                    preview={false}
                                                    alt='alt'
                                                />
                                            );
                                        }
                                        return (
                                            <iframe
                                                style={{margin: '0 0'}}
                                                key="youtube-video"
                                                width="560"
                                                height="315"
                                                allowFullScreen={true}
                                                src={item.src}>
                                            </iframe>
                                        );
                                    })
                            }
                        </Carousel>
                        <Divider />
                        <>
                            {postDetail?.summary}
                        </>
                        <Comment
                            actions={[<span key="comment-nested-reply-to">Reply to</span>]}
                            author={<a>Han Solo</a>}
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                            content={
                                <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure).
                                </p>
                            }
                        >
                            <DiscussionEditor/>
                        </Comment>
                    </Col>

                    {/* Vote & connected information */}
                    <Col span={8}>
                        <Row>
                            <Button>
                                <CaretUpOutlined className='isVoted'/> Upvote
                            </Button>
                        </Row>
                        <Row>
                            <Image
                                src="https://joeschmoe.io/api/v1/random"
                                style={{ width: 30, height: 30 }}
                                preview={false}
                            />
                            <Image
                                src="https://joeschmoe.io/api/v1/random"
                                style={{ width: 30, height: 30 }}
                                preview={false}
                            />
                        </Row>

                        <Row>
                            <FacebookFilled/>
                            <GithubFilled />
                        </Row>

                        {/* Hunter and maker */}
                        <div>
                            <div>
                                Hunter
                            </div>
                            <SimpleCard 
                                title={projectMembers.hunter.name}
                                description={projectMembers.hunter.position}
                                image={projectMembers.hunter.avatar}
                            />
                            <div>
                                4 Makers
                            </div>

                            <div className='maker-container'>
                                {
                                    projectMembers.makers.map(maker => {
                                        return (
                                            <SimpleCard 
                                                key={maker.id}
                                                title={maker.name}
                                                description={maker.position}
                                                image={maker.avatar}
                                            />
                                        );
                                    })
                                }
                            </div>
                        </div>

                        {/* Related products */}
                        <Row>
                            <h3>
                                Related products
                            </h3>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </ClientLayout>
    );
}

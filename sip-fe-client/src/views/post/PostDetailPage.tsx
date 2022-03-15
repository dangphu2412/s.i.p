import { CaretDownFilled, CaretUpOutlined, FacebookFilled } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Image, List, Row, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { CommentContainer } from 'src/modules/discussion/components/CommentContainer';
import { TopFeatureBadge } from 'src/modules/post/components/badge/TopFeatureBadge';
import { VoteState } from 'src/modules/post/components/card/CardItemOverview';
import { PricingType } from 'src/modules/post/constants/post-status.enum';
import { PostActions } from 'src/modules/post/post.action';
import { VoteActions } from 'src/modules/vote/vote.action';
import { ArrayUtils } from 'src/utils/array.utils';
import { SimpleCard } from '../../components/card/SimpleCard';
import { PostDetail } from '../../modules/post/api/post.api';
import './post-detail.scss';

const contentStyle: React.CSSProperties = {
    color: '#fff',
    textAlign: 'center',
    background: '#364d79',
};

interface GalleryItem {
    type: 'image' | 'video',
    src: string;
    thumbnail: string;
}

export function PostDetailPage(): JSX.Element {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const [postDetail, setPostDetail] = useState<PostDetail>(
        {
            id: 'UNKNOWN',
            title: '',
            slug: '',
            description: '',
            author: {
                id: 'UNKNOWN',
                fullName: '',
                avatar: '',
                headline: ''
            },
            facebookLink: '',
            galleryImages: [],
            isVoted: false,
            makers: [],
            pricingType: PricingType.FREE,
            productLink: '',
            ranking: '1',
            socialPreviewImage: '',
            summary: '',
            thumbnail: '',
            topics: [],
            totalVotes: 0,
            videoLink: '',
            videoThumbnail: '',
            followers: [],
        }
    );
    const [vote, setVote] = useState<VoteState>({
        isVoted: postDetail.isVoted,
        voteTotal: +postDetail.totalVotes
    });

    const postDetailDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_POST_DETAIL));
    const authType = useSelector(selectAuthState);

    if (!slug) {
        throw new Error('Please recheck your routing. Post detail view is missing slug with key: slug');
    }

    useEffect(() => {
        dispatch(PostActions.getDetailData({ slug }));
    }, []);

    useEffect(() => {
        if (postDetailDataHolder?.data) {
            setPostDetail(postDetailDataHolder.data);
            setVote({
                isVoted: postDetailDataHolder.data.isVoted,
                voteTotal: postDetailDataHolder.data.totalVotes
            });
        }
    }, [postDetailDataHolder]);

    function getGallery(): GalleryItem[] {
        const gallery: GalleryItem[] = [];
        if (!ArrayUtils.isEmpty(postDetail.galleryImages)) {
            postDetail.galleryImages.forEach(img => {
                gallery.push({
                    src: img,
                    type: 'image',
                    thumbnail: img
                });
            });
        }

        if (postDetail.videoLink) {
            gallery.push({
                src: postDetail.videoLink,
                type: 'video',
                thumbnail: postDetail.videoThumbnail
            });
        }

        return gallery;
    }

    function handleVote(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        e.preventDefault();
        if (authType !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        dispatch(VoteActions.voteForPost({
            postId: postDetail.id
        }));
        setVote({
            isVoted: !vote.isVoted,
            voteTotal: vote.isVoted ? vote.voteTotal - 1 : vote.voteTotal + 1
        });
    }

    return (
        <ClientLayout>
            <div className='py-10'>
                <Container>
                    {/* Heading data */}
                    <Row className='m-3'>
                        {/* Thumbnail of product */}
                        <Col span={3}>
                            <Image
                                src={postDetail.thumbnail}
                                style={{ width: 100, height: 100 }}
                                preview={false}
                            />
                        </Col>
                        {/* Product introduction */}
                        <Col span={13}>
                            <Title level={3} style={{fontWeight: 500}}>
                                {postDetail.title}
                            </Title>

                            <div className='p-color'>{postDetail.summary}</div>

                            <div className='mt-2'>
                                {postDetail?.topics.map(topic => {
                                    return (<span key={topic.id}>
                                        {topic.name}
                                    </span>);
                                })}
                            </div>
                        </Col>

                        {/* Ranking */}
                        <Col span={8}>
                            {
                                postDetail.ranking === '1' &&
                            <TopFeatureBadge
                                rankTitle='#1 Product of the day'
                                dateRank={Date.now()}
                            />
                            }
                        </Col>
                    </Row>

                    {/* Main content */}
                    <Row className='m-3'>
                        {/* Gallery & detail and discussion */}
                        <Col span={16} className='pr-5'>
                            {/* Gallery */}
                            {/* TODO: Change way of rendering data */}
                            <div className='content-bg rounded shadow p-5 hover:shadow-md transition delay-100'>
                                <Carousel
                                    showThumbs={true}
                                    showArrows={false}
                                    showStatus={false}
                                    showIndicators={false}
                                    renderThumbs={
                                        () => {
                                            return getGallery()
                                                .map((item, index) => {
                                                    return <Image
                                                        key={index}
                                                        src={item.thumbnail}
                                                        style={contentStyle}
                                                        preview={false}
                                                        alt='alt'
                                                    />;
                                                });
                                        }
                                    }
                                >
                                    {
                                        getGallery()
                                            .map((item, index) => {
                                                if (item.type === 'image') {
                                                    return (
                                                        <Image
                                                            key={index}
                                                            src={item.src}
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
                                                        height="400"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen={true}
                                                        src={item.src}>
                                                    </iframe>
                                                );
                                            })
                                    }
                                </Carousel>
                                <Divider />
                                <div className='my-5'>
                                    {postDetail.summary}
                                </div>
                                <div className='my-5'>Have a question about this product? Ask the Makers</div>
                                <div>
                                    <Button>
                                        <FacebookFilled/> Share
                                    </Button>
                                </div>
                            </div>

                            <div className='mt-10 my-5'>
                                Discussion
                            </div>

                            <div
                                className='content-bg rounded shadow mr-3 p-5'
                            >
                                <CommentContainer slug={postDetail.slug}/>
                            </div>
                        </Col>

                        {/* Vote & connected information */}
                        <Col span={8}  className='pl-5'>
                            <Row className='rounded'>
                                <Col span={12} className='pr-2'>
                                    <Button danger className=' w-full'>
                                        <a href={postDetail.productLink} target='_blank' rel="noreferrer">
                                        Go to product
                                        </a>
                                    </Button>
                                </Col>

                                <Col span={12} className='pl-2'>
                                    <Button
                                        className={'w-full center ' + (vote.isVoted ? ' btn ' : '')}
                                        onClick={handleVote}
                                    >
                                        {
                                            vote.isVoted
                                                ? <CaretUpOutlined/>
                                                : <CaretDownFilled/>
                                        }
                                        Vote {vote.voteTotal}
                                    </Button>
                                </Col>
                            </Row>

                            <Row className='my-5 grid grid-cols-4 gap-3'>
                                {
                                    postDetail.followers.map(follower => {
                                        return (
                                            <Tooltip
                                                key={follower.id}
                                                title={follower.fullName}
                                            >
                                                <Image
                                                    key={follower.id}
                                                    src={follower.avatar}
                                                    style={{ width: 30, height: 30}}
                                                    className='cursor-pointer'
                                                    preview={false}
                                                />
                                            </Tooltip>
                                        );
                                    })
                                }
                            </Row>

                            <Row className='my-5 gap-3'>
                                {
                                    postDetail.facebookLink &&
                                    <a
                                        href={postDetail.facebookLink} className='text-lg button-text-color'
                                        target='_blank'
                                        rel='noreferrer'
                                    >
                                        <FacebookFilled className='text-lg'/>
                                    </a>
                                }
                            </Row>

                            {/* Hunter and maker */}
                            <div className='shadow rounded-md content-bg p-5 hover:shadow-md transition delay-100'>
                                <p className='button-text-color'>
                                    Hunter
                                </p>
                                <SimpleCard
                                    title={postDetail.author.fullName}
                                    description={postDetail.author.headline}
                                    image={postDetail.author.avatar}
                                />
                                <div className='mt-5'>
                                    {postDetail.makers.length} Sip-ers
                                </div>

                                <div className='mt-3 maker-container'>
                                    <List
                                        dataSource={postDetail.makers}
                                        itemLayout="horizontal"
                                        renderItem={maker => (
                                            <List.Item.Meta
                                                className='my-2'
                                                avatar={<Avatar src={maker.avatar} />}
                                                title={<a href="https://ant.design">{maker.fullName}</a>}
                                                description={maker.headline}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Related products */}
                            <Row className='mt-5'>
                                <h3>
                                Related products
                                </h3>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ClientLayout>
    );
}

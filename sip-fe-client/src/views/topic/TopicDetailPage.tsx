import { Breadcrumb, Button, Col, Divider, Row, Skeleton, Spin } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { PostOverview } from 'src/modules/post/api/post.api';
import { CardItemOverview } from 'src/modules/post/components/card/CardItemOverview';
import { FilterDropdown } from 'src/modules/post/components/dropdown/FilterDropdown';
import { PostFilter } from 'src/modules/post/constants/post-filter.enum';
import { PostActions } from 'src/modules/post/post.action';
import { Page } from 'src/modules/query/interface';
import { Topic, TopicWithFollowStatus } from 'src/modules/topic/api/topic.api';
import { TopicActions } from 'src/modules/topic/topic.action';

export function TopicDetailPage(): JSX.Element {
    const { slug } = useParams();

    if (!slug) {
        throw new Error('Missing topic id when render topic detail. Please check routing');
    }

    const dispatch = useDispatch();

    const [detail, setDetail] = useState<TopicWithFollowStatus>({
        id: 'UNKNOWN',
        avatar: '',
        name: '',
        slug: '',
        summary: '',
        followed: false
    });
    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<PostFilter>(PostFilter.HOTTEST);
    const [page, setPage] = useState<Page>({
        page: 1,
        size: 20
    });
    const [follow, setFollow] = useState(false);

    const topicDetailDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_TOPIC_DETAIL));
    const postOverviewDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_POST_OVERVIEW));
    const authState = useSelector(selectAuthState);

    useEffect(() => {
        dispatch(TopicActions.findDetail(slug));
    }, []);

    useEffect(() => {
        if (topicDetailDataHolder?.data) {
            setDetail(topicDetailDataHolder.data as TopicWithFollowStatus);
            setLoading(true);
            setPosts([]);
            const page = {
                page: 1,
                size: 20
            };
            setPage(page);
            dispatch(PostActions.getOverviewData({
                page: page,
                filters: [
                    {
                        column: 'type',
                        comparator: 'eq',
                        value: selectedFilter
                    },
                    {
                        column: 'topicName',
                        comparator: 'eq',
                        value: (topicDetailDataHolder.data as Topic).name
                    }
                ]
            }));
            setFollow((topicDetailDataHolder.data as TopicWithFollowStatus).followed);
            setLoading(false);
        }
    }, [topicDetailDataHolder]);

    useEffect(() => {
        setLoading(true);
        setPosts([]);
        const newPage = {
            page: 1,
            size: 20
        };
        setPage(newPage);
        dispatch(PostActions.getOverviewData({
            page: newPage,
            filters: [
                {
                    column: 'type',
                    comparator: 'eq',
                    value: selectedFilter
                },
                {
                    column: 'topicName',
                    comparator: 'eq',
                    value: detail.name
                }
            ]
        }));
        setLoading(false);
    }, [selectedFilter]);


    useEffect(() => {
        if (postOverviewDataHolder?.data) {
            setPosts(posts.concat(
                postOverviewDataHolder.data
            ));
        }
    }, [postOverviewDataHolder]);

    function loadMore() {
        setLoading(true);

        const newPage = {
            ...page,
            page: page.page + 1,
        };

        dispatch(PostActions.getOverviewData({
            page: newPage,
            filters: [
                {
                    column: 'type',
                    comparator: 'eq',
                    value: selectedFilter
                }
            ]
        }));

        setPage(newPage);

        setLoading(false);
    }

    function followTopic(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();
        if (authState !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        dispatch(TopicActions.followTopic(detail.id));
        setFollow(!follow);
    }

    return (
        <ClientLayout>
            <Container>
                <div className='py-10'>
                    <div>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <Link to='/topics'>Topics</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{detail.slug}</Breadcrumb.Item>
                        </Breadcrumb>

                        <Title>
                            {detail.name}
                        </Title>

                        <div>
                            {detail.summary}
                        </div>

                        <Button
                            danger={follow} className='mt-5'
                            onClick={followTopic}
                        >
                            {follow ? 'Following' : 'Follow'}
                        </Button>
                    </div>

                    <Divider/>

                    <Row>
                        <Col span={16}>
                            <div className='flex justify-between'>
                                <div>
                                Best of {detail.name}
                                </div>

                                <FilterDropdown
                                    selectedValue={selectedFilter}
                                    setSelected={setSelectedFilter}
                                    options={Object.values(PostFilter)}
                                />
                            </div>


                            <InfiniteScroll
                                dataLength={posts.length}
                                next={loadMore}
                                hasMore={true}
                                loader={<Spin />}
                            >
                                {
                                    posts.map(post => {
                                        return <Link
                                            to={'/posts/' + post.slug}
                                            key={post.id}
                                            className='cursor-pointer my-2 transition delay-50'
                                        >
                                            <CardItemOverview
                                                key={post.id}
                                                data={post}
                                                authType={authState}
                                            />
                                        </Link>;
                                    })
                                }
                                <Skeleton loading={isLoading} />
                            </InfiniteScroll>
                        </Col>
                        <Col span={8}></Col>
                    </Row>
                </div>
            </Container>
        </ClientLayout>
    );
}

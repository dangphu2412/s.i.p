import { Breadcrumb, Button, Col, Divider, Row, Skeleton, Spin } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { PostOverview } from 'src/modules/post/api/post.api';
import { CardItemOverview } from 'src/modules/post/components/card/CardItemOverview';
import { FilterDropdown } from 'src/modules/post/components/dropdown/FilterDropdown';
import { PostFilter } from 'src/modules/post/constants/post-filter.enum';
import { PostActions } from 'src/modules/post/post.action';
import { Page } from 'src/modules/query/interface';

export function TopicDetailPage(): JSX.Element {
    const { slug } = useParams();

    if (!slug) {
        throw new Error('Missing topic id when render topic detail. Please check routing');
    }

    const dispatch = useDispatch();

    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<PostFilter>(PostFilter.HOTTEST);
    const [page, setPage] = useState<Page>({
        page: 1,
        size: 20
    });

    const dataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_POST_OVERVIEW));
    const authState = useSelector(selectAuthState);

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
                    value: slug
                }
            ]
        }));
        setLoading(false);
    }, [selectedFilter]);

    useEffect(() => {
        if (dataHolder?.data) {
            setPosts(posts.concat(
                dataHolder.data
            ));
        }
    }, [dataHolder]);

    function loadMorePosts() {
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

    return (
        <ClientLayout>
            <Container>
                <div className='py-10'>
                    <div>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <Link to='/topics'>Topics</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{slug}</Breadcrumb.Item>
                        </Breadcrumb>

                        <Title>
                            {slug}
                        </Title>

                        <div>
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio repellat illo a omnis, aspernatur, quasi distinctio voluptates expedita temporibus, odio neque doloribus nostrum nam ratione recusandae veritatis placeat nihil ipsum.
                        </div>

                        <Button danger className='mt-5'>
                                Follow
                        </Button>
                    </div>

                    <Divider/>

                    <Row>
                        <Col span={16}>
                            <div className='flex justify-between'>
                                <div>
                                Best of {slug}
                                </div>

                                <FilterDropdown
                                    selectedValue={selectedFilter}
                                    setSelected={setSelectedFilter}
                                    options={Object.values(PostFilter)}
                                />
                            </div>


                            <InfiniteScroll
                                dataLength={posts.length}
                                next={loadMorePosts}
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

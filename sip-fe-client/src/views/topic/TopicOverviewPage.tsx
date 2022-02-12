import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Input, List, Row, Select, Skeleton, Spin } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { selectLoading } from 'src/modules/loading/loading.selector';
import { Page } from 'src/modules/query/interface';
import { TopicWithFollowStatus } from 'src/modules/topic/api/topic.api';
import { TopicCard } from 'src/modules/topic/components/TopicCard';
import { GetTopicType } from 'src/modules/topic/constants/get-topic-type.enum';
import { TopicActions } from 'src/modules/topic/topic.action';

export function TopicOverviewPage(): JSX.Element {
    const dispatch = useDispatch();
    const [filterSelected, setFilterSelected] = useState<GetTopicType>(GetTopicType.TRENDING);
    const isLoading = useSelector(selectLoading);
    const [topics, setTopics] = useState<TopicWithFollowStatus[]>([]);
    const [page, setPage] = useState<Page>({
        page: 1,
        size: 20
    });
    const [search, setSearch] = useState('');

    const topicDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.SEARCH_TOPIC));
    const authState = useSelector(selectAuthState);

    useEffect(() => {
        const resetPage = {
            page: 1,
            size: 20
        };
        setTopics([]);
        setPage(resetPage);
        dispatch(TopicActions.findMany({
            filters: [{
                column: 'type',
                comparator: 'eq',
                value: filterSelected
            }],
            sorts: [],
            page: resetPage
        }));
    }, [filterSelected]);

    useEffect(() => {
        if (topicDataHolder?.data) {
            setTopics(topics.concat(topicDataHolder.data as TopicWithFollowStatus[]));
        }
    }, [topicDataHolder]);

    function loadMore() {
        const newPage = {
            page: page.page + 1,
            size: page.size
        };
        dispatch(TopicActions.findMany({
            filters: [{
                column: 'type',
                comparator: 'eq',
                value: filterSelected
            }],
            sorts: [],
            page: newPage,
            search
        }));
        setPage(newPage);
    }

    function onSearchEvent(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setSearch(e.target.value);
        setPage({
            page: 1,
            size: 20
        });
        setTopics([]);
        dispatch(TopicActions.findMany({
            filters: [{
                column: 'type',
                comparator: 'eq',
                value: filterSelected
            }],
            sorts: [],
            page: {
                page: 0,
                size: 20
            },
            search: e.target.value
        }));
    }

    return (
        <ClientLayout>
            <Container>
                <div className='py-10'>
                    <Row>
                        <Col span={16}>
                            <Title>
                                Topics
                            </Title>
                            <div className='p-color'>
                                Follow your favorite topics to be the first to learn about the newest product arrivals in that space.
                                You&apos;ll get the most out of Product Hunt if you follow at least three, with notifications about new launches every time you visit.
                            </div>
                            <div className='flex justify-between my-5'>
                                <Input
                                    className='bg-sky-light max-w-xs'
                                    placeholder="Search Topics ..."
                                    suffix={ <FontAwesomeIcon icon='search'/> }
                                    onChange={onSearchEvent}
                                    value={search}
                                />

                                <Select 
                                    defaultValue={filterSelected}
                                    style={{ width: 120 }}
                                    onSelect={filter => { setFilterSelected(filter);}}
                                >
                                    {
                                        Object.keys(GetTopicType).map((typeKey) => {
                                            const filterValue = GetTopicType[typeKey as keyof typeof GetTopicType];
                                            return <Select.Option
                                                key={filterValue} 
                                                value={filterValue}
                                            >
                                                {filterValue}
                                            </Select.Option>;
                                        })
                                    }
                                </Select>
                            </div>

                            <InfiniteScroll
                                dataLength={topics.length}
                                next={loadMore}
                                hasMore={true}
                                loader={<Spin />}
                            >
                                <List
                                    dataSource={topics}
                                    itemLayout="horizontal"
                                    renderItem={item => <Link
                                        to={`/topics/${item.slug}`}
                                    >
                                        <TopicCard
                                            className='my-5'
                                            data={item}
                                            authState={authState}
                                        />
                                    </Link>}
                                />
                                <Skeleton loading={isLoading.isLoading} />
                            </InfiniteScroll>
                        </Col>
                        <Col span={8}></Col>
                    </Row>
                </div>
            </Container>
        </ClientLayout>
    );
}

import { Avatar, Button, List, Skeleton, Spin } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { TopicWithFollowStatus } from '../api/topic.api';
import { GetTopicType } from '../constants/get-topic-type.enum';
import { TopicCard } from './TopicCard';

export interface TopicOverviewContainerProps {
    filterType: GetTopicType;
}

export function TopicOverviewContainer(props: TopicOverviewContainerProps) {
    const topics: TopicWithFollowStatus[] = [
        {
            avatar: 'https://joeschmoe.io/api/v1/random',
            followed: true,
            id: '1',
            name: 'Technology',
            slug: 'technology',
            summary: 'Some summary'
        },
        {
            avatar: 'https://joeschmoe.io/api/v1/random',
            followed: false,
            id: '1',
            name: 'Technology',
            slug: 'technology',
            summary: 'Some summary'
        }
    ];

    const [isLoading, setLoading] = useState(false);
    const authState = useSelector(selectAuthState);
    function loadMore() {
        return;
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={topics.length}
                next={loadMore}
                hasMore={true}
                loader={<Spin />}
            >
                <List
                    dataSource={topics}
                    itemLayout="horizontal"
                    renderItem={item => <TopicCard
                        className='my-5'
                        data={item}
                        authState={authState}
                    />}
                />
                <Skeleton loading={isLoading} />
            </InfiniteScroll>
            
        </div>
    );
}

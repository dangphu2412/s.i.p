import { Skeleton } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadMore } from '../../../../components/progress/LoadMore';
import { CardItemOverview } from './CardItemOverview';
// 
export function CardContainer(): JSX.Element {
    const data = [
        {
            title: 'Hello dmm',
            slug: 'Hello dmm',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 10,
            isVoted: true
        },
        {
            title: 'Hello',
            slug: 'Hello dmm',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 12,
            isVoted: false
        },
        {
            title: 'Hello',
            slug: 'Hello dmm',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 15,
            isVoted: true
        },
        {
            title: 'Hello',
            slug: 'Hello dmm',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        },
        {
            title: 'Hello',
            slug: 'Hello dmm',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        }
    ];
    const [posts, setPosts] = useState(data);
    const [isLoading, setLoading] = useState(false);
    function loadMorePosts() {
        setLoading(true);
        setTimeout(() => {
            setPosts(posts.concat(
                posts
            ));
            setLoading(false);
        }, 1500);
    }
    
    return (
        <div>
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMorePosts}
                hasMore={true}
                loader={<LoadMore/>}
            >
                {
                    posts.map((post, index) => {
                        return <a
                            href={'/post/' + post.slug}
                            key={index}
                        >
                            <CardItemOverview
                                key={index}
                                data={{id: index, ...post}}
                            />
                        </a>;
                    })
                }
                { isLoading && <Skeleton></Skeleton> }
            </InfiniteScroll>
        </div>
    );
}

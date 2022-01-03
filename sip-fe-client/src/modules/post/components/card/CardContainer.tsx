import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadMore } from '../../../../components/progress/LoadMore';
import { CardItemOverview } from './CardItemOverview';

export default function CardContainer(): JSX.Element {
    const data = [
        {
            title: 'Hello dmm',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 10,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 12,
            isVoted: false
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 15,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        }
    ];
    const [posts, setPosts] = useState(data);
    function loadMorePosts() {
        setTimeout(() => {
            setPosts(posts.concat(
                posts
            ));
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
                            href='/post/1'
                            key={index}
                        >
                            <CardItemOverview
                                key={index}
                                data={{id: index, ...post}}
                            />
                        </a>;
                    })
                }
            </InfiniteScroll>
        </div>
    );
}

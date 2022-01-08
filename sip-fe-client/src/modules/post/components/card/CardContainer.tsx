import { Skeleton } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { LoadMore } from '../../../../components/progress/LoadMore';
import { selectFilter, selectPage } from '../../../../modules/query/query.selector';
import { PostOverview } from '../../api/post.api';
import { fetchPosts } from '../../post.action';
import { CardItemOverview } from './CardItemOverview';

export function CardContainer(): JSX.Element {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const filter = useSelector(selectFilter);
    const page = useSelector(selectPage);

    function loadMorePosts() {
        setLoading(true);
        setTimeout(() => {
            const newPosts = (dispatch(fetchPosts({
                page,
                filter
            })) as unknown) as PostOverview;
            setPosts(posts.concat(
                newPosts
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
                                data={post}
                            />
                        </a>;
                    })
                }
                <Skeleton loading={isLoading} />
            </InfiniteScroll>
        </div>
    );
}

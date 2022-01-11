import { Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { LoadMore } from '../../../../components/progress/LoadMore';
import { selectFilter, selectPage } from '../../../../modules/query/query.selector';
import { PostOverview } from '../../api/post.api';
import { fetchPosts } from '../../post.action';
import { CardItemOverview } from './CardItemOverview';
import { selectDataHolderByView } from '../../../data/data.selector';

export function CardContainer(): JSX.Element {
    const dispatch = useDispatch();
    const dataHolder = useSelector(selectDataHolderByView('POST'));
    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const filter = useSelector(selectFilter);
    const page = useSelector(selectPage);

    function loadMorePosts() {
        setLoading(true);
        setTimeout(() => {
            dispatch(fetchPosts({
                page,
                filter
            }));
            if (dataHolder) {
                setPosts(posts.concat(
                    dataHolder.data
                ));
            }
            setLoading(false);
        }, 1500);
    }

    useEffect(() => {
        loadMorePosts();
    }, []);

    
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

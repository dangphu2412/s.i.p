import { Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter, selectPage } from '../../../../modules/query/query.selector';
import { selectDataHolderByView } from '../../../data/data.selector';
import { PostOverview } from '../../api/post.api';
import { fetchPosts } from '../../post.action';
import { CardItemOverview } from './CardItemOverview';

export function CardContainer(): JSX.Element {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const filter = useSelector(selectFilter);
    const page = useSelector(selectPage);
    const dataHolder = useSelector(selectDataHolderByView('POST'));
    
    useEffect(() => {
        loadMorePosts();
    }, []);

    useEffect(() => {
        if (dataHolder) {
            setPosts(posts.concat(
                dataHolder.data
            ));
        }
    }, [dataHolder]);

    function loadMorePosts() {
        setLoading(true);
        dispatch(fetchPosts({
            page,
            filter
        }));
        setLoading(false);
    }
    
    return (
        <div>
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMorePosts}
                hasMore={true}
                loader={<Spin />}
            >
                {
                    posts.map((post, index) => {
                        return <a
                            href={'/posts/' + post.slug}
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

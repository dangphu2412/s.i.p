import { Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { cleanData } from 'src/modules/data/data.action';
import { Page } from 'src/modules/query/interface';
import { selectDataHolderByView } from '../../../data/data.selector';
import { IdeaOverview } from '../../api/post.api';
import { PostActions } from '../../post.action';
import { CardIdeaOverview } from './CardIdeaOverview';

export function IdeaContainer(): JSX.Element {
    const dispatch = useDispatch();

    const [posts, setPosts] = useState<IdeaOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState<Page>({
        page: 1,
        size: 20
    });

    const dataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_IDEA_OVERVIEW));
    const authState = useSelector(selectAuthState);

    useEffect(() => {
        setLoading(true);
        setPosts([]);
        const newPage = {
            page: 1,
            size: 20
        };
        setPage(newPage);
        dispatch(PostActions.getIdeas({
            page: newPage,
        }));
        setLoading(false);
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_POST_OVERVIEW));
        };
    }, []);

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

        dispatch(PostActions.getIdeas({
            page: newPage,
        }));

        setPage(newPage);

        setLoading(false);
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMorePosts}
                hasMore={isLoading}
                loader={<Spin />}
            >
                {
                    posts.map(post => {
                        return <Link
                            to={'/posts/' + post.slug}
                            key={post.id}
                            className='cursor-pointer my-2 transition delay-50'
                        >
                            <CardIdeaOverview
                                key={post.id}
                                data={post}
                                authType={authState}
                            />
                        </Link>;
                    })
                }
                <Skeleton loading={isLoading} />
            </InfiniteScroll>
        </div>
    );
}

import { Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { Page } from 'src/modules/query/interface';
import { PostOverview } from '../../api/post.api';
import { PostActions } from '../../post.action';
import { CardItemOverview } from './CardItemOverview';

export interface ProfileCardContainerProps {
    hashTag: string;
}

export function ProfileCardContainer(props: ProfileCardContainerProps): JSX.Element {
    const dispatch = useDispatch();

    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState<Page>({
        page: 0,
        size: 20
    });

    const dataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_POST_AUTHOR_IDEAS));
    const authState = useSelector(selectAuthState);

    useEffect(() => {
        dispatch(PostActions.getAuthorIdeas({
            page,
            filters: [],
            hashTag: props.hashTag
        }));
        setPage({
            ...page,
            page: page.page + 1,
        });
    }, []);

    useEffect(() => {
        if (dataHolder?.data) {
            setPosts(posts.concat(
                dataHolder.data
            ));
        }

        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_POST_AUTHOR_IDEAS));
        };
    }, [dataHolder]);

    function loadMorePosts() {
        setLoading(true);

        dispatch(PostActions.getAuthorIdeas({
            page,
            filters: [],
            hashTag: props.hashTag
        }));

        setPage({
            ...page,
            page: page.page + 1,
        });

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
                    posts.map(post => {
                        return <a
                            href={'/posts/' + post.slug}
                            key={post.id}
                            className='cursor-pointer hover:shadow my-2 transition delay-50'
                        >
                            <CardItemOverview
                                key={post.id}
                                data={post}
                                authType={authState}
                            />
                        </a>;
                    })
                }
                <Skeleton loading={isLoading} />
            </InfiniteScroll>
        </div>
    );
}

import { Button, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { Page } from 'src/modules/query/interface';
import { selectDataHolderByView } from '../../../data/data.selector';
import { PostOverview } from '../../api/post.api';
import { PostFilter } from '../../constants/post-filter.enum';
import { PostActions } from '../../post.action';
import { FilterDropdown } from '../dropdown/FilterDropdown';
import { CardItemOverview } from './CardItemOverview';

// UI to load posts
export function CardContainer(): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<PostFilter>(PostFilter.HOTTEST);
    const [page, setPage] = useState<Page>({
        page: 0,
        size: 20
    });

    const dataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.POST_OVERVIEW));
    const authState = useSelector(selectAuthState);
    
    useEffect(() => {
        setPosts([]);
        loadMorePosts();
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

        dispatch(PostActions.getOverviewData({
            page,
            filters: [
                {
                    column: 'type',
                    comparator: 'eq',
                    value: selectedFilter
                }
            ]
        }));

        setPage({
            ...page,
            page: page.page + 1,
        });

        setLoading(false);
    }
    
    return (
        <div>
            <FilterDropdown
                selectedValue={selectedFilter}
                setSelected={setSelectedFilter}
                options={Object.values(PostFilter)}
            />

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

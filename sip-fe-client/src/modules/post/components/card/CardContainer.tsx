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
import { PostOverview } from '../../api/post.api';
import { PostFilter } from '../../constants/post-filter.enum';
import { PostActions } from '../../post.action';
import { FilterDropdown } from '../dropdown/FilterDropdown';
import { CardItemOverview } from './CardItemOverview';

export function CardContainer(): JSX.Element {
    const dispatch = useDispatch();

    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<PostFilter>(PostFilter.HOTTEST);
    const [page, setPage] = useState<Page>({
        page: 1,
        size: 15
    });

    const dataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_POST_OVERVIEW));
    const authState = useSelector(selectAuthState);

    useEffect(() => {
        setLoading(true);
        setPosts([]);
        const newPage = {
            page: 1,
            size: 15
        };
        setPage(newPage);
        dispatch(PostActions.getOverviewData({
            page: newPage,
            filters: [
                {
                    column: 'type',
                    comparator: 'eq',
                    value: selectedFilter
                }
            ]
        }));
        setLoading(false);
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_POST_OVERVIEW));
        };
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

        const newPage = {
            ...page,
            page: page.page + 1,
        };

        dispatch(PostActions.getOverviewData({
            page: newPage,
            filters: [
                {
                    column: 'type',
                    comparator: 'eq',
                    value: selectedFilter
                }
            ]
        }));

        setPage(newPage);

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
                        return <Link
                            to={'/posts/' + post.slug}
                            key={post.id}
                            className='cursor-pointer my-2 transition delay-50'
                        >
                            <CardItemOverview
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

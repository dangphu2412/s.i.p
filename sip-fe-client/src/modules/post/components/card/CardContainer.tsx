import { Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Page } from 'src/modules/query/interface';
import { selectDataHolderByView } from '../../../data/data.selector';
import { PostOverview } from '../../api/post.api';
import { PostFilter } from '../../constants/post-filter.enum';
import { fetchPosts } from '../../post.action';
import { FilterDropdown } from '../dropdown/FilterDropdown';
import { CardItemOverview } from './CardItemOverview';

// UI to load posts
export function CardContainer(): JSX.Element {
    const dispatch = useDispatch();

    const [posts, setPosts] = useState<PostOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<PostFilter>(PostFilter.HOTTEST);
    const [page, setPage] = useState<Page>({
        page: 0,
        size: 20
    });

    const dataHolder = useSelector(selectDataHolderByView('POST'));
    
    useEffect(() => {
        loadMorePosts();
    }, [selectedFilter]);

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

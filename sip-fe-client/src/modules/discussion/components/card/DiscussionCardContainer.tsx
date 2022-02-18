import { List, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { Page } from 'src/modules/query/interface';
import { DiscussionOverview } from '../../api/discussion.api';
import { DiscussionActions } from '../../discussion.action';
import { DiscussionCard } from './DiscussionCard';

export interface DiscussionCardContainerProps {
    filter: string;
    search: string;
}

export function DiscussionCardContainer(props: DiscussionCardContainerProps): JSX.Element {
    const { filter, search } = props;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<Page>({
        page: 1,
        size: 20
    });
    const [discussions, setDiscussions] = useState<DiscussionOverview>([]);
    const authState = useSelector(selectAuthState);
    const discussionDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_DISCUSSIONS));

    useEffect(() => {
        setLoading(true);
        const resetPage = {
            page: 1,
            size: 20
        };
        setDiscussions([]);
        setPage(resetPage);

        dispatch(DiscussionActions.getDiscussions({
            filters: [{
                column: 'type',
                comparator: 'eq',
                value: filter
            }],
            sorts: [],
            page: resetPage
        }));
        setLoading(false);
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_DISCUSSIONS));
        };
    }, [filter, search]);

    useEffect(() => {
        if (discussionDataHolder?.data) {
            setDiscussions(discussions.concat(discussionDataHolder.data));
        }
    }, [discussionDataHolder]);

    function loadMore() {
        setLoading(true);
        const newPage = {
            page: page.page + 1,
            size: page.size
        };
        dispatch(DiscussionActions.getDiscussions({
            filters: [{
                column: 'type',
                comparator: 'eq',
                value: filter
            }],
            sorts: [],
            page: newPage,
            search
        }));
        setPage(newPage);
        setLoading(false);
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={discussions.length}
                next={loadMore}
                hasMore={loading}
                loader={<Spin />}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={discussions}
                    renderItem={item =>
                        <DiscussionCard
                            key={item.id}
                            authType={authState}
                            {
                                ...item
                            }
                        />}
                >
                    <Skeleton loading={loading} />
                </List>
            </InfiniteScroll>

        </div>
    );
}

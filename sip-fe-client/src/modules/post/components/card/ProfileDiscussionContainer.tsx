import { List, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { DiscussionOverview } from 'src/modules/discussion/api/discussion.api';
import { DiscussionCard } from 'src/modules/discussion/components/card/DiscussionCard';
import { DiscussionActions } from 'src/modules/discussion/discussion.action';
import { Page } from 'src/modules/query/interface';
import { PostActions } from '../../post.action';

export interface ProfileCardContainerProps {
    hashTag: string;
}

export function ProfileDiscussionContainer(props: ProfileCardContainerProps): JSX.Element {
    const dispatch = useDispatch();

    const [discussions, setDiscussions] = useState<DiscussionOverview>([]);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState<Page>({
        page: 0,
        size: 20
    });

    const dataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_DISCUSSIONS));
    const authState = useSelector(selectAuthState);

    useEffect(() => {
        if (!props.hashTag) {
            return;
        }
        setLoading(true);
        dispatch(DiscussionActions.getDiscussions({
            filters: [{
                column: 'type',
                comparator: 'eq',
                value: 'byUserHashTag'
            }],
            sorts: [],
            page
        }));
        setPage((page) => ({
            ...page,
            page: page.page + 1
        }));
        setLoading(false);
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_DISCUSSIONS));
        };
    }, []);

    useEffect(() => {
        if (dataHolder?.data) {
            setDiscussions(discussions.concat(
                dataHolder.data
            ));
        }
    }, [dataHolder]);

    function loadMore() {
        setLoading(true);
        const newPage = {
            page: page.page + 1,
            size: page.size
        };

        dispatch(PostActions.getAuthorIdeas({
            page: newPage,
            filters: [],
            hashTag: props.hashTag
        }));

        setPage(newPage);

        setLoading(false);
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={discussions.length}
                next={loadMore}
                hasMore={isLoading}
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
                    <Skeleton loading={isLoading} />
                </List>
            </InfiniteScroll>
        </div>
    );
}

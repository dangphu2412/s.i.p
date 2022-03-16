import { List, Skeleton, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { MessageType } from 'src/modules/app.types';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { DiscussionOverviewExtension } from 'src/modules/discussion/api/discussion.api';
import { DiscussionCard } from 'src/modules/discussion/components/card/DiscussionCard';
import { DiscussionActions } from 'src/modules/discussion/discussion.action';
import { fireMessage } from 'src/modules/message/message.action';
import { Page } from 'src/modules/query/interface';
import { PostActions } from '../../post.action';

export interface ProfileCardContainerProps {
    hashTag: string;
}

export function ProfileDiscussionContainer(props: ProfileCardContainerProps): JSX.Element {
    const dispatch = useDispatch();

    const [discussions, setDiscussions] = useState<DiscussionOverviewExtension>([]);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState<Page>({
        page: 0,
        size: 20
    });

    const dataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_DISCUSSIONS));
    const changeDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.DISCUSSION_CHANGE));
    const authState = useSelector(selectAuthState);

    useEffect(() => {
        if (!props.hashTag) {
            return;
        }
        setLoading(true);
        dispatch(DiscussionActions.getDiscussions({
            filters: [{
                column: 'hashTag',
                comparator: 'eq',
                value: props.hashTag
            }],
            sorts: [],
            page
        }));
        setPage((currPage) => ({
            ...currPage,
            page: currPage.page + 1
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

    useEffect(() => {
        if (changeDataHolder?.data) {
            if (changeDataHolder?.data === 'DELETE_SUCCESS') {
                setLoading(true);
                setDiscussions([]);
                const newPage: Page = {
                    page: 0,
                    size: 15
                };
                dispatch(DiscussionActions.getDiscussions({
                    filters: [{
                        column: 'hashTag',
                        comparator: 'eq',
                        value: props.hashTag
                    }],
                    sorts: [],
                    page: newPage
                }));
                setPage(newPage);
                setLoading(false);
                dispatch(fireMessage({
                    type: MessageType.SUCCESS,
                    message: 'Delete success'
                }));
            }
        }
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.DISCUSSION_CHANGE));
        };
    }, [changeDataHolder]);


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
                            crudExtension={{
                                canDelete: item.canDelete,
                                canUpdate: item.canUpdate,
                                readonly: item.readonly
                            }}
                        />}
                >
                    <Skeleton loading={isLoading} />
                </List>
            </InfiniteScroll>
        </div>
    );
}

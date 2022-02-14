import React, {useEffect, useState} from 'react';
import {ClientLayout} from 'src/layouts/client/ClientLayout';
import {Container} from '../../components/container/Container';
import Title from 'antd/lib/typography/Title';
import {Avatar, Button, List, Spin} from 'antd';
import {EditPostViewDto} from '../../modules/post/api/post.api';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {selectDataHolderByView} from '../../modules/data/data.selector';
import {VIEW_SELECTOR} from '../../constants/views.constants';
import {PostActions} from '../../modules/post/post.action';
import { cleanData } from 'src/modules/data/data.action';
import { selectProfile } from 'src/modules/auth/auth.selector';
import { Page } from 'src/modules/query/interface';
import InfiniteScroll from 'react-infinite-scroll-component';

export function Products(): JSX.Element {
    const dispatch = useDispatch();

    const [products, setProducts] = useState<EditPostViewDto[]>([]);
    const [page, setPage] = useState<Page>({
        page: 1,
        size: 20
    });

    const profile = useSelector(selectProfile);
    const selfProductsDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_POST_AUTHOR_IDEAS));

    useEffect(() => {
        loadMore();

        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_POST_AUTHOR_IDEAS));
        };
    }, []);


    useEffect(() => {
        if (selfProductsDataHolder?.data) {
            setProducts(products.concat(selfProductsDataHolder.data as EditPostViewDto[]));
        }
    }, [selfProductsDataHolder]);

    function loadMore() {
        if (!profile) {
            throw new Error('Missing profile when loading self products');
        }
        dispatch(PostActions.getAuthorIdeas({
            hashTag: profile?.hashTag,
            page,
            filters: [
                {
                    column: 'scope',
                    comparator: 'eq',
                    value: 'true'
                }
            ]
        }));

        setPage({
            ...page,
            page: page.page + 1
        });
    }

    function onDeleteProduct(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();
        dispatch(PostActions.deleteDraft('1'));
    }

    return <ClientLayout>
        <Container>
            <InfiniteScroll
                dataLength={products.length}
                next={loadMore}
                hasMore={true}
                loader={<Spin />}
            >
                <List
                    dataSource={products}
                    itemLayout="horizontal"
                    header={
                        <Title level={3}>
                            My ideas
                        </Title>
                    }
                    renderItem={({canDelete, canUpdate, status, thumbnail, title, readonly, slug}) => {
                        return <List.Item className={'flex justify-between items-center'}>
                            <List.Item.Meta
                                avatar={<Avatar shape='square' size={86} src={thumbnail} />}
                                title={<div>{title}</div>}
                                description={status}
                            />
                            {
                                canUpdate && <Button
                                    style={{width: '126px'}}
                                    className='ml-5'
                                >
                                    <Link
                                        to={`/posts/new/${slug}`}
                                    >
                                    Continue Editing
                                    </Link>
                                </Button>
                            }

                            {
                                canDelete && <Button
                                    style={{width: '126px'}}
                                    className='ml-5'
                                    onClick={onDeleteProduct}
                                >
                                    <FontAwesomeIcon
                                        icon='trash'
                                    />
                                </Button>
                            }

                            {
                                readonly && <Button
                                    style={{width: '126px'}}
                                    className='ml-5'
                                >
                                    <Link
                                        to={`/posts/${slug}`}
                                    >
                                    View Post
                                    </Link>
                                </Button>
                            }
                        </List.Item>;
                    }}
                />
            </InfiniteScroll>
        </Container>
    </ClientLayout>;
}

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, List, Modal, Spin } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { selectProfile } from 'src/modules/auth/auth.selector';
import { cleanData } from 'src/modules/data/data.action';
import { Page } from 'src/modules/query/interface';
import { Container } from '../../components/container/Container';
import { VIEW_SELECTOR } from '../../constants/views.constants';
import { selectDataHolderByView } from '../../modules/data/data.selector';
import { EditPostViewDto } from '../../modules/post/api/post.api';
import { PostActions } from '../../modules/post/post.action';

export function Products(): JSX.Element {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
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
        setLoading(true);
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
        setLoading(false);
    }

    function confirmDelete(id: string) {
        Modal.confirm({
            title: 'Are you sure you want to delete this draft?',
            icon: <ExclamationCircleOutlined />,
            content: <>
                <p>
                    You are about to delete your draft idea.
                </p>
            </>,
            okType: 'danger',
            onOk() {
                dispatch(PostActions.deleteDraft(id));
            }
        });
    }

    return <ClientLayout>
        <Container>
            <InfiniteScroll
                dataLength={products.length}
                next={loadMore}
                hasMore={loading}
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
                    renderItem={({canDelete, canUpdate, status, thumbnail, title, readonly, slug, id}) => {
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
                                        to={`/posts/edit/${slug}`}
                                    >
                                    Continue Editing
                                    </Link>
                                </Button>
                            }

                            {
                                canDelete && <Button
                                    style={{width: '126px'}}
                                    className='ml-5'
                                    onClick={() => confirmDelete(id)}
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

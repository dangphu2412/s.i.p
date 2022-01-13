import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { fetchPostDetail } from 'src/modules/post/post.action';

export function PostDetailPage(): JSX.Element {
    const dispatch = useDispatch();
    const { postId } = useParams();
    const dataHolder = useSelector(selectDataHolderByView('POST_DETAIL'));

    if (!postId) {
        throw new Error('Please recheck your routing. Post detail view is missing postId with key: postId');
    }
    
    useEffect(() => {
        if (!dataHolder) {
            dispatch(fetchPostDetail({ postId }));
        }
    }, [dataHolder]);

    return (
        <ClientLayout>
            Hello detail
        </ClientLayout>
    );
}

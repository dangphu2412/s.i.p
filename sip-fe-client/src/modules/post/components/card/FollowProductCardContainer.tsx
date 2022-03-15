import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { PostActions } from '../../post.action';
import { FollowProductCard } from './FollowProductCard';

export interface UpcomingIdeas {
    id: string;
    title: string;
    summary: string;
    isFollowed: boolean;
}

export function FollowProductCardContainer(): JSX.Element {
    const dispatch = useDispatch();

    const [products, setProducts] = useState<UpcomingIdeas[]>([]);
    const dataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_IDEA_OVERVIEW));
    const authState = useSelector(selectAuthState);

    useEffect(() => {
        dispatch(PostActions.getIdeas({
            page: {
                page: 0,
                size: 3
            },
        }));
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_POST_OVERVIEW));
        };
    }, []);

    useEffect(() => {
        if (dataHolder?.data) {
            setProducts(dataHolder.data);
        }
    }, [dataHolder]);


    return <>
        {
            products.map(product => {
                return <FollowProductCard
                    key={product.id}
                    authState={authState}
                    {
                        ...product
                    }
                />;
            })
        }
    </>;
}

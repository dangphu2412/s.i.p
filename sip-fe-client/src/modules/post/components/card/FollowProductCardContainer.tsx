import React, { useEffect, useState } from 'react';
import { FollowProductCard, FollowProductProps } from './FollowProductCard';

export function FollowProductCardContainer() {
    const [products, setProducts] = useState<FollowProductProps[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    function loadProducts() {
        // TODO: Fetch apis
        setProducts([
            {
                id: '1',
                title: ' Abserund Design 2',
                followed: true,
                summary: 'Description: here is some desciption'
            },
            {
                id: '2',
                title: ' Abserund Design q1',
                followed: false,
                summary: 'Description: here is some others desciption'
            }
        ]);
    }
    
    return <>
        {
            products.map(product => {
                return <FollowProductCard
                    key={product.id}
                    {
                        ...product
                    }
                />;
            })
        }
    </>;
}

import React from 'react';
import { CardItemOverview } from './CardItemOverview';

export default function CardContainer(): JSX.Element {
    const posts = [
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 10
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 12
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 15
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20
        }
    ];
    return (
        <div>
            {
                posts.map((post, index) => {
                    return <CardItemOverview
                        key={index}
                        data={post}
                    />;
                })
            }
        </div>
    );
}

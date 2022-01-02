import React from 'react';
import { LoadMore } from '../../../../components/progress/LoadMore';
import { CardItemOverview } from './CardItemOverview';

export default function CardContainer(): JSX.Element {
    const posts = [
        {
            title: 'Hello dmm',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 10,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 12,
            isVoted: false
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 15,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        },
        {
            title: 'Hello',
            summary: 'This is summary',
            topics: ['Free', 'Web app'],
            totalVote: 20,
            isVoted: true
        }
    ];
    return (
        <div>
            {
                posts.map((post, index) => {
                    return <a
                        href='/post/1'
                        key={index}
                    >
                        <CardItemOverview
                            key={index}
                            data={{id: index, ...post}}
                        />
                    </a>;
                })
            }
            <LoadMore/>
        </div>
    );
}

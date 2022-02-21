import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, Card, List } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { IdeaSummary } from '../../api/post.api';
import './index.scss';

export interface VoteState {
    isVoted: boolean;
    voteTotal: number;
}

interface CardItemOverviewProps {
    data: IdeaSummary;
    authType: AuthType;
}

export function CardIdeaOverview({ data, authType }: CardItemOverviewProps): JSX.Element {
    const dispatch = useDispatch();
    const [followed, setFollowed] = useState<boolean>(false);

    function handleFollow(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();
        if (authType !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        setFollowed(!followed);
    }

    return (
        <div className='card-cover'>
            <Card
                bordered={false}
                bodyStyle={{padding: '0'}}
            >
                <div className='flex justify-between items-center'>
                    <List.Item.Meta
                        avatar={<Avatar shape='square' size={86} src={data.thumbnail} />}
                        title={<Title level={4}>
                            {data.title}
                        </Title>}
                        description={
                            <div className='mt-3'>
                                <div>{data.summary}</div>
                                <span className='mr-3'>
                                    <FontAwesomeIcon icon="comment" className='mr-3'/>
                                    {data.totalReplies}
                                </span>
                                {
                                    data.topics.map((topic, index) => {
                                        return <span className='mr-2' key={index}>{topic.name}</span>;
                                    })
                                }
                            </div>
                        }
                    />
                    <div className='pr-10'>
                        <Button onClick={handleFollow}>

                        </Button>
                    </div>
                </div>

            </Card>
        </div>
    );
}

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, Card, Col, Image, List, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { voteForPost } from 'src/modules/vote/vote.action';
import { PostSummary } from '../../api/post.api';
import './index.scss';

export interface VoteState {
    isVoted: boolean;
    voteTotal: number;
}

interface CardItemOverviewProps {
    data: PostSummary;
    authType: AuthType;
}

export function CardItemOverview({ data, authType }: CardItemOverviewProps): JSX.Element {
    const dispatch = useDispatch();
    const [vote, setVote] = useState<VoteState>({
        isVoted: data.isAuthor,
        voteTotal: +data.totalVotes
    });

    function handleVote(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        e.preventDefault();
        if (authType !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        dispatch(voteForPost({
            postId: data.id
        }));
        setVote({
            isVoted: !vote.isVoted,
            voteTotal: vote.isVoted ? vote.voteTotal - 1 : vote.voteTotal + 1
        });
    }

    return (
        <div className='card-cover'>
            <Card
                bordered={false}
                bodyStyle={{padding: '0'}}
            >
                <div className='flex justify-between items-center'>
                    <List.Item.Meta
                        avatar={<Avatar shape='square' size={86} src={'https://joeschmoe.io/api/v1/random'} />}
                        title={<Title level={4}>
                            {data.title}
                        </Title>}
                        description={
                            <div className='mt-3'>
                                <span className='mr-3'>
                                    <FontAwesomeIcon icon="comment" className='mr-3'/>
                                80
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
                        <Button className={vote.isVoted ? 'upvote-style btn': 'upvote-style'} onClick={handleVote}>
                            { 
                                vote.isVoted ?
                                    <CaretUpOutlined/> 
                                    : <CaretDownOutlined/>
                            }
                            <div>
                                { vote.voteTotal }
                            </div>
                            
                        </Button>
                    </div>
                </div>
                
            </Card>
        </div>
    );
}
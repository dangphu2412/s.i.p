import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Image, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { voteForPost } from 'src/modules/vote/vote.action';
import { PostSummary } from '../../api/post.api';
import './index.scss';

interface VoteState {
    isVoted: boolean;
    voteTotal: number;
}

interface CardItemOverviewProps {
    data: PostSummary
}

export function CardItemOverview(props: CardItemOverviewProps): JSX.Element {
    const dispatch = useDispatch();
    const [vote, setVote] = useState<VoteState>({
        isVoted: props.data.isAuthor,
        voteTotal: +props.data.totalVotes
    });

    function handleVote(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        dispatch(voteForPost({
            postId: props.data.id
        }));
        e.preventDefault();
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
                <Row>
                    <Col
                        span={2}
                        style={{display: 'flex', alignItems: 'center'}}
                    >
                        <Image
                            src="https://joeschmoe.io/api/v1/random"
                            style={{ width: 80 }}
                            preview={false}
                        />
                    </Col>
                    <Col span={18}>
                        <Title level={4}>
                            {props.data.title}
                        </Title>

                        <div>
                            {props.data.summary}
                        </div>
                        <div className='mt-3'>
                            <span className='mr-3'>
                                <FontAwesomeIcon icon="comment" className='mr-3'/>
                                80
                            </span>
                            {
                                props.data.topics.map((topic, index) => {
                                    return <span className='mr-2' key={index}>{topic.name}</span>;
                                })
                            }
                        </div>
                    </Col>
                    <Col span={4}>
                        <Button className={'upvote-style ' + (vote.isVoted ? 'btn' : '')} onClick={handleVote}>
                            { 
                                vote.isVoted ?
                                    <CaretUpOutlined/> 
                                    : <CaretDownOutlined/>
                            }
                            <div>
                                { vote.voteTotal }
                            </div>
                            
                        </Button>
                    </Col>
                </Row>
                
            </Card>
        </div>
    );
}
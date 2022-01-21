import { PostSummary } from '../../api/post.api';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import './index.scss';

interface CardItemOverviewProps {
    data: PostSummary
}

export function CardItemOverview(props: CardItemOverviewProps): JSX.Element {
    const [isVoted, setIsVoted] = useState(props.data.isAuthor);
    function handleVote(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        e.preventDefault();
        setIsVoted(!isVoted);
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
                            style={{ width: 36 }}
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
                        <div>
                            {
                                props.data.topics.map((topic, index) => {
                                    return <span className='mr-2' key={index}>{topic.name}</span>;
                                })
                            }
                        </div>
                    </Col>
                    <Col span={4}>
                        <Button className={'upvote-style ' + (isVoted ? 'btn' : '')} onClick={handleVote}>
                            { 
                                isVoted ?
                                    <CaretUpOutlined/> 
                                    : <CaretDownOutlined/>
                            }
                            <div>
                                { props.data.totalVotes }
                            </div>
                            
                        </Button>
                    </Col>
                </Row>
                
            </Card>
        </div>
    );
}
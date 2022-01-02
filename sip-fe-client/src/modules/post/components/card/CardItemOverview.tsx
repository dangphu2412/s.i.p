import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import '../../../../scss/global.scss';
import './index.scss';

interface CardItemOverviewProps {
    data: {
        id: number;
        title: string;
        summary: string;
        topics: string[];
        totalVote: number;
        isVoted: boolean;
    }
}

export function CardItemOverview(props: CardItemOverviewProps): JSX.Element {
    const [isVoted, setIsVoted] = useState(props.data.isVoted);
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
                                    return <span className='mr-2' key={index}>{topic}</span>;
                                })
                            }
                        </div>
                    </Col>
                    <Col span={4}>
                        <Button className='upvote-style' onClick={handleVote}>
                            { 
                                isVoted ?
                                    <CaretUpOutlined className='isVoted'/> 
                                    : <CaretDownOutlined/>
                            }
                            <div>
                                { props.data.totalVote }
                            </div>
                            
                        </Button>
                    </Col>
                </Row>
                
            </Card>
        </div>
    );
}
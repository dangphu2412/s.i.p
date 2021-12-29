import React from 'react';
import { Avatar, Button, Card, Col, Image, Row } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';

interface CardItemOverviewProps {
    data: {
        title: string;
        summary: string;
        topics: string[];
        totalVote: number;
    }
}

export function CardItemOverview(props: CardItemOverviewProps): JSX.Element {
    return (
        <>
            <Card>
                <Row>
                    <Col span={4}>
                        <Avatar src={
                            <Image
                                src="https://joeschmoe.io/api/v1/random"
                                style={{ width: 36 }}
                                preview={false}
                            />}
                        />
                    </Col>
                    <Col span={16}>
                        <div>
                            {props.data.title}
                        </div>
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
                        <Button className='h-full'>
                            <CaretUpOutlined />
                            <div>
                                { props.data.totalVote }
                            </div>
                        </Button>
                    </Col>
                </Row>
                
            </Card>
        </>
    );
}
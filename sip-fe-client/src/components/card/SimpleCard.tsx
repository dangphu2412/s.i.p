import { Col, Row, Avatar } from 'antd';
import React from 'react';

export interface SimpleCardProps {
    image: string;
    title: string;
    description: string;
}

export function SimpleCard(props: SimpleCardProps): JSX.Element {
    return (
        <Row>
            <Col span={4}>
                <Avatar
                    src={props.image}
                />
            </Col>

            <Col span={20}>
                <a href='#'>
                    {props.title}
                </a>
                <div>{props.description}</div>
            </Col>
        </Row>
    );
}

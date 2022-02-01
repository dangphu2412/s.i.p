import React from 'react';
import {Row, Col, Image} from 'antd';

export interface SimpleCardProps {
    image: string;
    title: string;
    description: string;
}

export function SimpleCard(props: SimpleCardProps): JSX.Element {
    return (
        <Row>
            <Col span={4}>
                <Image
                    src={props.image}
                    style={{ width: 30, height: 30 }}
                    preview={false}
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

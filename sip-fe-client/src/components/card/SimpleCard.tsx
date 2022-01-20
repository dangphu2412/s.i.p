import React from 'react';
import {Row, Col, Image} from 'antd';

export interface SimpleCardProps {
    image: string;
    title: string;
    description: string;
}

export function SimpleCard(props: SimpleCardProps) {
    return (
        <Row>
            <Col>
                <Image
                    src={props.image}
                    style={{ width: 30, height: 30 }}
                    preview={false}
                />
            </Col>

            <Col>
                <h3>{props.title}</h3>
                <div>{props.description}</div>
            </Col>
        </Row>
    );
}

import { FireOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import './index.scss';

interface FeatureProps {
    rankTitle: string;
    dateRank: number;
}

export function TopFeatureBadge(props: FeatureProps): JSX.Element {
    return (
        <Row className='badge-container rounded justify-end'>
            <Col>
                <FireOutlined className='badge'/>
            </Col>
            <Col>
                <b>{props.rankTitle}</b>
                <div>{props.dateRank}</div>
            </Col>
        </Row>
    );
}

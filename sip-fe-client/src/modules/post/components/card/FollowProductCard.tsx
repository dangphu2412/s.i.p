import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Image, Row } from 'antd';
import React, { useState } from 'react';
export interface FollowProductProps {
    id: string;
    title: string;
    summary: string;
    followed: boolean;
}

interface FollowState {
    followed: boolean;
}

export function FollowProductCard(props: FollowProductProps): JSX.Element {
    const [follow, setFollow] = useState<FollowState>(props.followed ? {
        followed: props.followed
    } : {
        followed: props.followed
    });

    function handleFollowUpComingProduct() {
        setFollow({
            followed: !follow.followed
        });
        return;
    }
    return <Row key={props.id} className='mt-5'>
        <Col span={20}>
            <div className='mb-2'>
                { props.title }
            </div>

            <div>
                { props.summary }
            </div>

            <div className='cursor-pointer' onClick={handleFollowUpComingProduct}>
                {
                    follow.followed ?
                        <div>
                            <FontAwesomeIcon icon='check-circle' className='mr-3'/>
                            Following
                        </div>
                        :  <div>
                            <FontAwesomeIcon icon='plus-circle' className='mr-3'/>
                            Follow
                        </div>
                }

            </div>
        </Col>

        <Col span={4}>
            <Image
                src={'https://joeschmoe.io/api/v1/random'}
                style={{ width: 30, height: 30 }}
                preview={false}
            />
        </Col>
    </Row>;
}

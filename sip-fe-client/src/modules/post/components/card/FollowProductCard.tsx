import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Image, Row } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { PostActions } from '../../post.action';
export interface FollowProductProps {
    id: string;
    title: string;
    summary: string;
    isFollowed: boolean;
    authState: AuthType
}

export function FollowProductCard(props: FollowProductProps): JSX.Element {
    const dispatch = useDispatch();
    const [follow, setFollow] = useState<boolean>(props.isFollowed);

    function handleFollowUpComingProduct() {
        if (props.authState !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        setFollow(!props.isFollowed);
        dispatch(PostActions.followIdeaById(props.id));
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
                    follow ?
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

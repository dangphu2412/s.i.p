import { Avatar, List } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { Topic } from '../api/topic.api';
import { TopicActions } from '../topic.action';

export function ListingTopic(): JSX.Element {
    const dispatch = useDispatch();
    const [topics, setTopics] = useState<Topic[]>([]);
    const topicDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.SEARCH_TOPIC));

    useEffect(() => {
        dispatch(TopicActions.getMany({
            filters: [],
            sorts: [],
            page: {
                page: 0,
                size: 20
            }
        }));
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.SEARCH_TOPIC));
        };
    }, []);

    useEffect(() => {
        if (topicDataHolder?.data) {
            setTopics(topicDataHolder.data);
        }
    }, [topicDataHolder]);


    return (
        <div>
            <div className='mb-8'>
                Topics
            </div>
            <List
                dataSource={topics}
                renderItem={item => (
                    <Link to={`/topics/${item.slug}`}>
                        <List.Item.Meta
                            className='my-3'
                            avatar={<Avatar shape='square' src={item.avatar} alt={item.name} />}
                            title={
                                <Title level={5}>
                                    {item.name}
                                </Title>}
                        />
                    </Link>
                )}
            />
        </div>
    );
}

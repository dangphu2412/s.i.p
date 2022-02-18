import { createAction } from '@reduxjs/toolkit';
import { Query } from '../query/interface';

export const TopicActions = {
    getMany: createAction<Query>('TOPIC/SEARCH'),
    getDetail: createAction<string>('TOPIC/DETAIL'),
    followTopic: createAction<string>('TOPIC/FOLLOW'),
};

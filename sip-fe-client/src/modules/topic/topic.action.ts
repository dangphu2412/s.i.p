import { createAction } from '@reduxjs/toolkit';
import { Query } from '../query/interface';

export const TopicActions = {
    findMany: createAction<Query>('TOPIC/SEARCH'),
    findDetail: createAction<string>('TOPIC/DETAIL'),
    followTopic: createAction<string>('TOPIC/FOLLOW'),
};

import { createAction } from '@reduxjs/toolkit';
import { Query } from '../query/interface';

export const TopicActions = {
    findMany: createAction<Query>('TOPIC/SEARCH'),
    followTopic: createAction<string>('TOPIC/FOLLOW'),
};
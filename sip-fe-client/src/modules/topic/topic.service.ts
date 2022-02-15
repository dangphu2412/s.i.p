import { RequestProcessor } from './../http/http-request';
import axios from 'axios';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { parseToSearchParams } from '../query/search-parser';
import { Topic } from './api/topic.api';

export function searchTopics(query: Query): RequestProcessor<Topic[]> {
    return createRequest<Topic[], Record<string, unknown>>(axios.get('/v1/topics', {
        params: parseToSearchParams(query),
        headers: {}
    }));
}

export function followTopic(topicId: string): RequestProcessor<string> {
    return createRequest<string, Record<string, unknown>>(axios.patch(`/v1/topics/${topicId}/follow`));
}

export function getTopicDetail(slug: string): RequestProcessor<Topic> {
    return createRequest<Topic, void>(axios.get(`/v1/topics/${slug}`));
}

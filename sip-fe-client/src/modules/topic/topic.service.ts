import axios from 'axios';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { parseToSearchParams } from '../query/search-parser';
import { Topic } from './api/topic.api';

export function searchTopics(query: Query) {
    return createRequest<Topic[], Record<string, unknown>>(axios.get('/v1/topics', {
        params: parseToSearchParams(query),
        headers: {}
    }));
}
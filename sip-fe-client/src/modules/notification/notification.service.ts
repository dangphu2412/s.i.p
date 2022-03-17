import axios from 'axios';
import { createRequest, RequestProcessor } from '../http/http-request';
import { Notification } from './notification.action';

export function getNotifications(): RequestProcessor<Notification[]> {
    return createRequest<Notification[], void>(axios.get('/v1/users/notifications'));
}

export function updateIsReadNotifications(ids: string[]): RequestProcessor<void> {
    return createRequest<void, void>(axios.put('/v1/users/notifications', {
        ids
    }));
}

import { createAction } from '@reduxjs/toolkit';

export interface Notification {
    id: string;
    title: string;
    link: string;
    isRead: boolean;
}

export interface NotificationPayload {
    notifications: Notification[];
    unreadCount: number;
    unreadNotifications: Notification[];
}

export const NotificationActions = {
    getNotifications: createAction('NOTIFICATION/GET_MANY'),
    updateIsReadNotifications: createAction<string[]>('NOTIFICATION/SET_IS_READ'),
};

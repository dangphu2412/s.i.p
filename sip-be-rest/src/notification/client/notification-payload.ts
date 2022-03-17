import { Notification } from '@notification/notification.entity';

export interface NotificationPayload {
  notifications: Notification[];
  unreadCount: number;
  unreadNotifications: Notification[];
}

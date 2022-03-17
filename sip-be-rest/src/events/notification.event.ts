import { TimeTracker } from '@database/base/time-tracker';
import { Notification } from '@notification/notification.entity';

export type SendNotificationEvent = Omit<
  Notification,
  keyof TimeTracker | 'receiver' | 'id' | 'isRead'
> & { receiverIds: string[] };

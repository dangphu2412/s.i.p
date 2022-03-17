import { TimeTracker } from '@database/base/time-tracker';
import { User } from '@user/user.entity';
import { Notification } from './notification.entity';

export type CreateNotificationDto = Omit<
  Notification,
  keyof TimeTracker | 'receiver' | 'id' | 'isRead'
> & { receivers: User[] };

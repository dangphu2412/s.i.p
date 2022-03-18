import { UserModule } from './../user/user.module';
import { NotificationEventHandler } from './notification-event-handler';
import { Module } from '@nestjs/common';
import { NotificationModule } from '@notification/notification.module';

@Module({
  imports: [NotificationModule, UserModule],
  providers: [NotificationEventHandler],
})
export class EventModule {}

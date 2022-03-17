import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '@notification/notification.service';
import { UserService } from '@user/user.service';
import { xor } from 'lodash';
import { EventKeys } from './event-keys';
import { SendNotificationEvent } from './notification.event';

@Injectable()
export class NotificationEventHandler {
  private readonly logger: Logger;
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {
    this.logger = new Logger(NotificationEventHandler.name);
  }

  @OnEvent(EventKeys.SEND_NOTIFICATION)
  async handleSendNotification({
    receiverIds,
    ...createNotificationDto
  }: SendNotificationEvent) {
    const receivers = await this.userService.findByIds(receiverIds);
    if (receiverIds.length !== receivers.length) {
      const userDiffIds = receivers.map((i) => i.id);
      this.logger.log(
        `There are no user with ids: ${xor(
          receiverIds,
          userDiffIds,
        )} to send notification`,
      );
    }
    await this.notificationService.createMany({
      receivers,
      ...createNotificationDto,
    });
  }
}

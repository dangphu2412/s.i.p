import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './create-notification.dto';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  public async updateIsReadByIds(ids: string[], receiver: User) {
    const notifications = await this.notificationRepository.findByIds(ids, {
      where: {
        receiver,
        isRead: false,
      },
    });

    if (notifications.length !== ids.length) {
      throw new UnprocessableEntityException(
        'Contains notifications that user had read',
      );
    }

    await this.notificationRepository.update(ids, { isRead: true });
  }

  public createMany(dto: CreateNotificationDto) {
    const notifications = dto.receivers.map((receiver) => {
      const notification = new Notification();
      notification.title = dto.title;
      notification.link = dto.link;
      notification.receiver = receiver;
      return notification;
    });

    return this.notificationRepository.save(notifications, {
      reload: false,
      chunk: 10,
    });
  }
}

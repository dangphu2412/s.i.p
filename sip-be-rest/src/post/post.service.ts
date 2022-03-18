import { ArrayMapper } from '@external/mappers/array.mapper';
import { ArrayUtils } from '@external/utils/array/array.utils';
import { MediaService } from '@media/media.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Topic } from '@topic/topic.entity';
import { TopicService } from '@topic/topic.service';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { SlugUtils } from '@utils/slug';
import { SendNotificationEvent } from 'src/events/notification.event';
import { EventKeys } from './../events/event-keys';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    private readonly topicService: TopicService,
    private readonly mediaService: MediaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async sendNewCommentNotificationToFollowersAndAuthor(
    post: Post,
    author: User,
  ) {
    const eventMessage: SendNotificationEvent = {
      receiverIds: post.followers.map((f) => f.id).concat(post.author.id),
      title: `User ${author.fullName} has commented on post ${post.title}`,
      link: `/posts/${post.slug}`,
    };
    this.eventEmitter.emit(EventKeys.SEND_NOTIFICATION, eventMessage);
  }

  public async sendPublishNotificationToTopicFollowers(post: Post) {
    const topics = await this.topicService.findTopicsWithFollowers(
      post.topics.map((topic) => topic.id),
    );
    topics.forEach((topic) => {
      const eventMessage: SendNotificationEvent = {
        receiverIds: topic.followers.map((f) => f.id),
        title: `Topic ${topic.name} has a new post: ${post.title}`,
        link: `/posts/${post.slug}`,
      };
      this.eventEmitter.emit(EventKeys.SEND_NOTIFICATION, eventMessage);
    });
  }

  public async updatePost(
    baseData: Post,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const oldTopicIds = ArrayMapper.mapByKey<Topic, string>(
      baseData.topics,
      'id',
    );
    const oldMakerIds = ArrayMapper.mapByKey<User, string>(
      baseData.makers,
      'id',
    );
    const newTopicIds = [...new Set(updatePostDto.topicIds)];
    const newMakerIds = [...new Set(updatePostDto.makerIds)];

    if (baseData.title !== updatePostDto.title) {
      baseData.title = updatePostDto.title;
      baseData.slug = SlugUtils.normalize(baseData.title);
    }

    if (!ArrayUtils.isDiff(oldTopicIds, newTopicIds)) {
      baseData.topics = await this.topicService.findByIds(
        updatePostDto.topicIds,
      );
    }

    if (!ArrayUtils.isDiff(oldMakerIds, newMakerIds)) {
      baseData.makers = await this.userService.findByIds(
        updatePostDto.makerIds,
      );
    }

    baseData.description = updatePostDto.description;
    baseData.summary = updatePostDto.summary;
    baseData.facebookLink = updatePostDto.socialMedia.facebookLink;
    baseData.videoLink = updatePostDto.socialMedia.videoLink;
    baseData.videoThumbnail = updatePostDto.socialMedia.videoLink
      ? this.mediaService.getYoutubeThumbnail(
          updatePostDto.socialMedia.videoLink,
        )
      : '';
    baseData.galleryImages = updatePostDto.socialMedia.galleryImages;
    baseData.socialPreviewImage = updatePostDto.socialMedia.socialPreviewImage;
    baseData.thumbnail = updatePostDto.socialMedia.thumbnail;
    baseData.isAuthorAlsoMaker = updatePostDto.isAuthorAlsoMaker;
    baseData.pricingType = updatePostDto.pricingType;
    baseData.runningStatus = updatePostDto.runningStatus;
  }
}

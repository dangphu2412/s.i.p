import { ArrayMapper } from '@external/mappers/array.mapper';
import { ArrayUtils } from '@external/utils/array/array.utils';
import { MediaService } from '@media/media.service';
import { Injectable } from '@nestjs/common';
import { Topic } from '@topic/topic.entity';
import { TopicService } from '@topic/topic.service';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { SlugUtils } from '@utils/slug';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    private readonly topicService: TopicService,
    private readonly mediaService: MediaService,
  ) {}

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

import { Assert } from '@external/error/error-assertion';
import { ArrayUtils } from '@external/utils/array/array.utils';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UpdatePostDto } from '@post/dto/update-post.dto';
import { ProductRunningStatus } from '@post/enums/post-status.enum';
import { Post } from '@post/post.entity';
import { Comparable } from './../../validator/validator-handler';

@Injectable()
export class PostPublishValidator implements Comparable<Post, UpdatePostDto> {
  compare(base: Post, updatePostDto: UpdatePostDto): void {
    Assert.isTrue(
      !!updatePostDto.title,
      () => new UnprocessableEntityException('Missing title to publish'),
    );

    Assert.isTrue(
      !!updatePostDto.summary,
      () => new UnprocessableEntityException('Missing summary to publish'),
    );

    Assert.isTrue(
      !!updatePostDto.description,
      () => new UnprocessableEntityException('Missing description to publish'),
    );

    Assert.isTrue(
      !!updatePostDto.socialMedia.thumbnail,
      () => new UnprocessableEntityException('Missing thumbnail to publish'),
    );

    Assert.isTrue(
      !!updatePostDto.socialMedia.socialPreviewImage,
      () =>
        new UnprocessableEntityException(
          'Missing socialPreviewImage to publish',
        ),
    );

    Assert.isTrue(
      ArrayUtils.isPresent(updatePostDto.socialMedia.galleryImages),
      () =>
        new UnprocessableEntityException(
          'Missing socialPreviewImage to publish',
        ),
    );

    if (ArrayUtils.isEmpty(updatePostDto.topicIds)) {
      throw new UnprocessableEntityException(
        'Required topicIds to run this product',
      );
    }

    if (updatePostDto.runningStatus === ProductRunningStatus.IDEA) {
      if (
        updatePostDto.links.productLink &&
        ArrayUtils.isPresent(updatePostDto.makerIds)
      ) {
        throw new UnprocessableEntityException(
          `Product is in idea status that we dont need product link and maker. Should it be updated to ${ProductRunningStatus.LOOKING_FOR_MEMBERS}`,
        );
      }
    }

    if (updatePostDto.runningStatus === ProductRunningStatus.RELEASED) {
      if (!updatePostDto.links.productLink) {
        throw new UnprocessableEntityException(
          'Missing product link that we cannot find your product',
        );
      }
    }
  }
}

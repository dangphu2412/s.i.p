import { Assert } from '@external/error/error-assertion';
import { ArrayUtils } from '@external/utils/array/array.utils';
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdatePostDto } from '@post/dto/update-post.dto';
import { ProductRunningStatus } from '@post/enums/post-status.enum';
import { Post } from '@post/post.entity';
import { PostRepository } from '@post/post.repository';
import { Comparable } from '@validator/validator-handler';

@Injectable()
export class PostUpdateValidator implements Comparable<Post, UpdatePostDto> {
  constructor(private readonly postRepository: PostRepository) {}

  async compare(post: Post, updatePostDto: UpdatePostDto): Promise<void> {
    if (post.title !== updatePostDto.title) {
      if (await this.postRepository.isTitleConflict(updatePostDto.title)) {
        throw new ConflictException(
          `Can not update post which is conflict with title: ${updatePostDto.title}`,
        );
      }
    }

    if (!!updatePostDto.launchSchedule) {
      if (ArrayUtils.isEmpty(updatePostDto.makerIds)) {
        throw new UnprocessableEntityException('Makers are required to launch');
      }
    }

    if (
      updatePostDto.runningStatus === ProductRunningStatus.LOOKING_FOR_MEMBERS
    ) {
      Assert.isTrue(
        (updatePostDto.isAuthorAlsoMaker &&
          ArrayUtils.atLeast(1, updatePostDto.makerIds)) ||
          (!updatePostDto.isAuthorAlsoMaker &&
            ArrayUtils.atLeast(0, updatePostDto.makerIds)),
        () =>
          new UnprocessableEntityException(
            'Author should be one of maker because you mark him as the author also maker',
          ),
      );
    }

    if (updatePostDto.runningStatus === ProductRunningStatus.PRE_RELEASED) {
      Assert.isTrue(
        !!updatePostDto.launchSchedule,
        () =>
          new UnprocessableEntityException(
            'Launch schedule is required when updating post to pre released',
          ),
      );
    }
  }
}

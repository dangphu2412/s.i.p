import { ArrayUtils } from '@external/utils/array/array.utils';
import { Assert } from '@external/error/error-assertion';
import { ProductRunningStatus } from '@post/enums/post-status.enum';
import { Post } from 'src/post/post.entity';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UpdatePostDto } from '@post/dto/update-post.dto';
import { Comparable } from './../../validator/validator-handler';

@Injectable()
export class PostReleaseValidator implements Comparable<Post, UpdatePostDto> {
  compare(base: Post, targetData: UpdatePostDto): void | Promise<void> {
    if (targetData.runningStatus === ProductRunningStatus.RELEASED) {
      Assert.isTrue(
        ArrayUtils.isPresent(targetData.makerIds),
        () => new UnprocessableEntityException('Missing makers when release'),
      );
    }
  }
}

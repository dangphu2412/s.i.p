import { ConflictException, Injectable } from '@nestjs/common';
import { UpdatePostDto } from '@post/dto/update-post.dto';
import { Post } from '@post/post.entity';
import { PostRepository } from '@post/post.repository';
import { Comparable } from '@validator/validator-handler';

@Injectable()
export class PostUpdateDraftValidator
  implements Comparable<Post, UpdatePostDto>
{
  constructor(private readonly postRepository: PostRepository) {}

  async compare(post: Post, updatePostDto: UpdatePostDto): Promise<void> {
    if (post.title !== updatePostDto.title) {
      if (await this.postRepository.isTitleConflict(updatePostDto.title)) {
        throw new ConflictException(
          `Can not update post which is conflict with title: ${updatePostDto.title}`,
        );
      }
    }
  }
}

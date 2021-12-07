import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { ToggleVoteDto } from '@modules/vote/dto/toggle-vote.dto';
import { VoteService } from '@modules/vote/vote.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private voteService: VoteService,
  ) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async toggleVoteOfPost(postId: number, author: UserCredential) {
    const post = await this.postRepository.findOne(postId);

    // Need to specify case where post is disable or this id is not valid
    if (!post) {
      throw new UnprocessableEntityException(
        'Post you are voting is not available',
      );
    }

    const voteDto = new ToggleVoteDto();

    voteDto.authorId = +author.userId;
    voteDto.post = post;

    return this.voteService.createOne(voteDto);
  }
}

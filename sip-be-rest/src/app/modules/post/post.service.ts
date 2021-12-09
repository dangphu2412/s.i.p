import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { User } from '@modules/user/user.entity';
import { UpsertVoteDto } from '@modules/vote/dto/upsert-vote.dto';
import { VoteService } from '@modules/vote/vote.service';
import {
  Injectable,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SlugUtils } from '@utils/slug';
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

  async create(createPostDto: CreatePostDto) {
    const isTitleConflict = await this.postRepository.count({
      where: {
        title: createPostDto.title,
      },
    });

    if (isTitleConflict) {
      throw new ConflictException(
        `Can not create post which is conflict with title: ${createPostDto.title}`,
      );
    }

    const post = Post.create(createPostDto);
    post.slug = SlugUtils.normalize(post.title);

    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
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

  async upsertVoteOfPost(postId: number, author: UserCredential) {
    const post = await this.postRepository.findOne(postId);

    // Need to specify case where post is disable or this id is not valid
    if (!post) {
      throw new UnprocessableEntityException(
        'Post you are voting is not available',
      );
    }

    const voteDto = new UpsertVoteDto();

    voteDto.user = User.create({ id: author.userId });
    voteDto.post = post;

    return this.voteService.upsertOne(voteDto);
  }
}

import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { UserService } from '@modules/user/user.service';
import { UpsertVoteDto } from '@modules/vote/dto/upsert-vote.dto';
import { VoteService } from '@modules/vote/vote.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SlugUtils } from '@utils/slug';
import { Repository } from 'typeorm';
import { ArrayUtils } from './../../../external/utils/array/array.utils';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FetchPostType } from './enums/fetch-post-type.enum';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private voteService: VoteService,
    private userService: UserService,
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

  findAll(searchQuery: SearchCriteria) {
    if (ArrayUtils.isEmpty(searchQuery.filters)) {
      return this.postRepository.find({
        relations: ['author', 'votes'],
        skip: searchQuery.offset,
        take: searchQuery.limit,
      });
    }

    const fetchPostType = searchQuery.filters[0];

    switch (fetchPostType.value) {
      case FetchPostType.HOTTEST:
        return this.findHottestPosts(searchQuery);
      case FetchPostType.LATEST:
        return this.findLatestPosts(searchQuery);
      default:
        throw new BadRequestException('Unsupported filter type to get posts');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  private findLatestPosts(searchQuery: SearchCriteria) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .getMany();
    return queryBuilder;
  }

  private findHottestPosts(searchQuery: SearchCriteria) {
    return this.postRepository.find();
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

    const user = await this.userService.findById(+author.userId);

    if (!user) {
      throw new UnprocessableEntityException(
        'User is not available to create post now',
      );
    }

    const voteDto = new UpsertVoteDto();

    voteDto.author = user;
    voteDto.post = post;

    return this.voteService.upsertOne(voteDto);
  }
}

import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SlugUtils } from '@utils/slug';
import { VoteService } from '@vote/vote.service';
import { UserCredential } from 'src/auth/client/user-cred';
import { DiscussionService } from 'src/discussion/discussion.service';
import { UserService } from 'src/user/user.service';
import { ArrayUtils } from '../external/utils/array/array.utils';
import { UpsertVoteDto } from './../vote/dto/upsert-vote.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FetchPostType } from './enums/fetch-post-type.enum';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly voteService: VoteService,
    private readonly userService: UserService,
    private readonly discussionService: DiscussionService,
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
    post.previewGalleryImg = post.galleryImages[0];

    return this.postRepository.save(post);
  }

  findMany(searchQuery: SearchCriteria, author: UserCredential | undefined) {
    if (ArrayUtils.isEmpty(searchQuery.filters)) {
      throw new BadRequestException('Required filter type to get posts');
    }

    const fetchPostType = searchQuery.filters[0];

    switch (fetchPostType.value) {
      case FetchPostType.LATEST:
        return this.postRepository.findLatestPosts(searchQuery, author);
      case FetchPostType.HOTTEST:
        return this.postRepository.findHottestPosts(searchQuery, author);
      default:
        throw new BadRequestException('Unsupported filter type to get posts');
    }
  }

  /**
   * Need to get:
   * - Basic information: title, slug, summary,
   * - voteStatus
   * - projectMember
   * - topics related
   * - thumbnails
   * - mainThumbnail
   */
  async findOne(slug: string, author: UserCredential | undefined) {
    const post = await this.postRepository.findOne({
      where: {
        slug,
      },
    });

    post.isVoted = author
      ? await this.voteService.didUserVoteForPost(author, post)
      : false;

    return post;
  }

  async findRelatedDiscussions(postId: number, searchCriteria: SearchCriteria) {
    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new UnprocessableEntityException(
        `Post with id: ${postId} does not exist that cannot find discussions`,
      );
    }

    return this.discussionService.findRelatedDiscussions(post, searchCriteria);
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

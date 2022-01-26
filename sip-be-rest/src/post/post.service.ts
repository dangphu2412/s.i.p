import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SetMapper } from '@external/mappers/set.mapper';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Topic } from '@topic/topic.entity';
import { TopicService } from '@topic/topic.service';
import { User } from '@user/user.entity';
import { SlugUtils } from '@utils/slug';
import { VoteService } from '@vote/vote.service';
import { UserCredential } from 'src/auth/client/user-cred';
import { DiscussionService } from 'src/discussion/discussion.service';
import { UserService } from 'src/user/user.service';
import { ArrayUtils } from '../external/utils/array/array.utils';
import { UpsertVoteDto } from './../vote/dto/upsert-vote.dto';
import { InitPostDto } from './dto/init-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FetchPostType } from './enums/fetch-post-type.enum';
import { PostStatus, ProductRunningStatus } from './enums/post-status.enum';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly voteService: VoteService,
    private readonly userService: UserService,
    private readonly discussionService: DiscussionService,
    private readonly topicService: TopicService,
  ) {}

  async init(initPostDto: InitPostDto, authContext: UserCredential) {
    const isTitleConflict = await this.postRepository.isTitleConflict(
      initPostDto.title,
    );

    if (isTitleConflict) {
      throw new ConflictException(
        `Can not create post which is conflict with title: ${initPostDto.title}`,
      );
    }

    const author = await this.userService.findById(+authContext.userId);

    if (!author) {
      throw new NotFoundException(
        `User is now not available in the system. Please contact system owner`,
      );
    }

    const post = new Post();
    post.title = initPostDto.title;
    post.slug = SlugUtils.normalize(post.title);
    post.status = PostStatus.DRAFT;
    post.runningStatus = initPostDto.productLink
      ? ProductRunningStatus.UP_COMING
      : ProductRunningStatus.STILL_IDEA;
    post.productLink = '';
    post.videoLink = '';
    post.facebookLink = '';

    post.summary = '';
    post.content = '';

    post.socialPreviewImage = '';
    post.galleryImages = [];
    post.thumbnail = '';
    post.author = author;

    return this.postRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne(id, {
      relations: ['topics', 'makers'],
    });

    const oldTopicIds = SetMapper.mapByKey<Topic, string>(post.topics, 'id');
    const oldMakerIds = SetMapper.mapByKey<User, string>(post.makers, 'id');

    if (!post) {
      throw new NotFoundException(`Post ${id} not found to update`);
    }

    // Update title and slug
    if (updatePostDto.title !== post.title) {
      // --  Can separate this validation logic
      const isTitleConflict = await this.postRepository.isTitleConflict(
        updatePostDto.title,
      );

      if (isTitleConflict) {
        throw new ConflictException(
          `Can not update post which is conflict with title: ${updatePostDto.title}`,
        );
      }
      // --
    }

    if (post.title !== updatePostDto.title) {
      post.title = updatePostDto.title;
      post.slug = SlugUtils.normalize(post.title);
    }

    if (!ArrayUtils.compareUnsorted(oldTopicIds, updatePostDto.topicIds)) {
      post.topics = await this.topicService.findByIds(updatePostDto.topicIds);
    }

    if (!ArrayUtils.compareUnsorted(oldMakerIds, updatePostDto.makerIds)) {
      post.makers = await this.userService.findByIds(updatePostDto.makerIds);
    }

    post.description = updatePostDto.description;
    post.summary = updatePostDto.summary;
    post.facebookLink = updatePostDto.gallery.facebookLink;
    post.videoLink = updatePostDto.gallery.videoLink;
    post.galleryImages = updatePostDto.gallery.galleryImages;
    post.socialPreviewImage = updatePostDto.gallery.socialPreviewImage;
    post.thumbnail = updatePostDto.gallery.thumbnail;
    post.isAuthorAlsoMaker = updatePostDto.isAuthorAlsoMaker;
    post.pricingType = updatePostDto.pricingType;
    // post.runningStatus
    // post.status
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

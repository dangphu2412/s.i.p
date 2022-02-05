import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { ArrayMapper } from '@external/mappers/array.mapper';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Topic } from '@topic/topic.entity';
import { TopicService } from '@topic/topic.service';
import { User } from '@user/user.entity';
import { SlugUtils } from '@utils/slug';
import { Vote } from '@vote/vote.entity';
import { VoteService } from '@vote/vote.service';
import { keyBy } from 'lodash';
import { UserCredential } from 'src/auth/client/user-cred';
import { DiscussionService } from 'src/discussion/discussion.service';
import { UserService } from 'src/user/user.service';
import { ArrayUtils } from '../external/utils/array/array.utils';
import { UpsertVoteDto } from './../vote/dto/upsert-vote.dto';
import { PostOverview } from './client/post-overview.api';
import { InitPostDto } from './dto/init-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FetchPostType } from './enums/fetch-post-type.enum';
import {
  PostStatus,
  PricingType,
  ProductRunningStatus,
} from './enums/post-status.enum';
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
    post.description = '';

    post.isAuthorAlsoMaker = false;
    post.pricingType = PricingType.FREE;
    post.socialPreviewImage = '';
    post.galleryImages = [];
    post.thumbnail = '';
    post.author = author;

    return this.postRepository.save(post);
  }

  public async findMany(
    searchQuery: SearchCriteria,
    author: UserCredential | undefined,
  ): Promise<PostOverview> {
    if (ArrayUtils.isEmpty(searchQuery.filters)) {
      throw new BadRequestException('Required filter type to get posts');
    }

    const fetchPostType = searchQuery.filters[0];

    let posts: PostOverview;
    switch (fetchPostType.value) {
      case FetchPostType.LATEST:
        posts = await this.postRepository.findLatestPosts(searchQuery);
        break;
      case FetchPostType.HOTTEST:
        posts = await this.postRepository.findHottestPosts(searchQuery);
        break;
      default:
        throw new BadRequestException('Unsupported filter type to get posts');
    }
    await this.markAuthorForPosts(posts, author);

    return posts;
  }

  async findOne(slug: string, optionalAuthor: UserCredential | undefined) {
    const post = await this.postRepository.findOne({
      where: {
        slug,
      },
      relations: ['topics', 'makers'],
    });

    if (!post) {
      throw new NotFoundException('Not found post with slug ' + slug);
    }

    post.isVoted = false;

    if (optionalAuthor) {
      const author: User = await this.userService.findById(
        +optionalAuthor.userId,
      );
      const isVoted: boolean = await this.voteService.didUserVoteForPost(
        author,
        post,
      );
      if (isVoted) {
        post.isVoted = true;
      }
    }

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

  public remove(id: number) {
    return `This action removes a #${id} post`;
  }

  public update(id: number, status: PostStatus, updatePostDto: UpdatePostDto) {
    switch (status) {
      case PostStatus.DRAFT:
        return this.saveAsDraft(id, updatePostDto);
      case PostStatus.PUBLISH:
        return this.publish(id, updatePostDto);
      default:
        throw new BadRequestException(
          `Cannot do update post with this action: ${status}`,
        );
    }
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

  async saveAsDraft(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne(id, {
      relations: ['topics', 'makers'],
    });

    const oldTopicIds = ArrayMapper.mapByKey<Topic, string>(post.topics, 'id');
    const oldMakerIds = ArrayMapper.mapByKey<User, string>(post.makers, 'id');
    const newTopicIds = [...new Set(updatePostDto.topicIds)];
    const newMakerIds = [...new Set(updatePostDto.makerIds)];

    if (!post) {
      throw new NotFoundException(`Post ${id} not found to update`);
    }

    if (post.status !== PostStatus.DRAFT) {
      throw new UnprocessableEntityException(
        `Post is not in status draft. Current status is : ${post.status}`,
      );
    }

    if (updatePostDto.title !== post.title) {
      const isTitleConflict = await this.postRepository.isTitleConflict(
        updatePostDto.title,
      );

      if (isTitleConflict) {
        throw new ConflictException(
          `Can not update post which is conflict with title: ${updatePostDto.title}`,
        );
      }
    }

    if (post.title !== updatePostDto.title) {
      post.title = updatePostDto.title;
      post.slug = SlugUtils.normalize(post.title);
    }

    if (!ArrayUtils.isDiff(oldTopicIds, newTopicIds)) {
      post.topics = await this.topicService.findByIds(updatePostDto.topicIds);
    }

    if (!ArrayUtils.isDiff(oldMakerIds, newMakerIds)) {
      post.makers = await this.userService.findByIds(updatePostDto.makerIds);
    }

    post.description = updatePostDto.description;
    post.summary = updatePostDto.summary;

    post.productLink = updatePostDto.links.productLink;
    post.facebookLink = updatePostDto.socialMedia.facebookLink;
    post.videoLink = updatePostDto.socialMedia.videoLink;
    post.thumbnail = updatePostDto.socialMedia.thumbnail;
    post.galleryImages = updatePostDto.socialMedia.galleryImages;
    post.socialPreviewImage = updatePostDto.socialMedia.socialPreviewImage;

    post.isAuthorAlsoMaker = updatePostDto.isAuthorAlsoMaker;

    post.pricingType = updatePostDto.pricingType;

    if (
      !updatePostDto.links.productLink &&
      post.runningStatus !== ProductRunningStatus.STILL_IDEA
    ) {
      post.runningStatus = ProductRunningStatus.STILL_IDEA;
    }

    if (
      updatePostDto.runningStatus === ProductRunningStatus.STILL_IDEA &&
      !!updatePostDto.links.productLink
    ) {
      post.runningStatus = ProductRunningStatus.LOOKING_FOR_MEMBERS;
    }

    if (!!updatePostDto.launchSchedule) {
      if (ArrayUtils.isEmpty(updatePostDto.makerIds)) {
        throw new UnprocessableEntityException('Makers are required to launch');
      }
      post.runningStatus = ProductRunningStatus.UP_COMING;
    }

    return this.postRepository.save(post);
  }

  async publish(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne(id, {
      relations: ['topics', 'makers'],
    });

    if (!post) {
      throw new NotFoundException(`Post ${id} not found to update`);
    }

    const oldTopicIds = ArrayMapper.mapByKey<Topic, string>(post.topics, 'id');
    const oldMakerIds = ArrayMapper.mapByKey<User, string>(post.makers, 'id');
    const newTopicIds = [...new Set(updatePostDto.topicIds)];
    const newMakerIds = [...new Set(updatePostDto.makerIds)];

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

    if (ArrayUtils.isEmpty(updatePostDto.topicIds)) {
      throw new UnprocessableEntityException(
        'Required topicIds to run this product',
      );
    }

    if (updatePostDto.runningStatus === ProductRunningStatus.STILL_IDEA) {
      if (
        updatePostDto.links.productLink &&
        ArrayUtils.isPresent(updatePostDto.makerIds)
      ) {
        throw new UnprocessableEntityException(
          `Product is in idea status that we dont need product link and maker. Should it be updated to ${ProductRunningStatus.LOOKING_FOR_MEMBERS} or ${ProductRunningStatus.UP_COMING}`,
        );
      }
    }

    if (
      updatePostDto.runningStatus === ProductRunningStatus.LOOKING_FOR_MEMBERS
    ) {
      if (
        updatePostDto.isAuthorAlsoMaker &&
        updatePostDto.makerIds.length > 1
      ) {
        throw new UnprocessableEntityException(
          'Product is looking for members. Cannot contains makers. Only author be maker because of you picked isAuthorAlsoMaker option',
        );
      }
    }

    if (updatePostDto.runningStatus === ProductRunningStatus.UP_COMING) {
      if (!updatePostDto.launchSchedule) {
        throw new UnprocessableEntityException(
          'Required launch schedule date to prepare for this upcoming product',
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

    if (
      updatePostDto.links.productLink &&
      ArrayUtils.isPresent(updatePostDto.makerIds) &&
      !updatePostDto.launchSchedule
    ) {
      post.runningStatus = ProductRunningStatus.RELEASED;
    }

    if (post.title !== updatePostDto.title) {
      post.title = updatePostDto.title;
      post.slug = SlugUtils.normalize(post.title);
    }

    if (!ArrayUtils.isDiff(oldTopicIds, newTopicIds)) {
      post.topics = await this.topicService.findByIds(updatePostDto.topicIds);
    }

    if (!ArrayUtils.isDiff(oldMakerIds, newMakerIds)) {
      post.makers = await this.userService.findByIds(updatePostDto.makerIds);
    }

    post.description = updatePostDto.description;
    post.summary = updatePostDto.summary;
    post.facebookLink = updatePostDto.socialMedia.facebookLink;
    post.videoLink = updatePostDto.socialMedia.videoLink;
    post.galleryImages = updatePostDto.socialMedia.galleryImages;
    post.socialPreviewImage = updatePostDto.socialMedia.socialPreviewImage;
    post.thumbnail = updatePostDto.socialMedia.thumbnail;
    post.isAuthorAlsoMaker = updatePostDto.isAuthorAlsoMaker;
    post.pricingType = updatePostDto.pricingType;

    post.status = PostStatus.PUBLISH;
    return this.postRepository.save(post);
  }

  private async markAuthorForPosts(
    posts: PostOverview,
    optionalAuthor: UserCredential | undefined,
  ): Promise<void> {
    if (optionalAuthor) {
      const author = await this.userService.findById(+optionalAuthor.userId);

      if (!author) {
        throw new UnauthorizedException('Your user is not available now');
      }

      const votes: Vote[] = await this.voteService.findByAuthorAndPosts(
        author,
        <Post[]>posts,
      );

      const postMap = keyBy(votes, 'post');

      posts.forEach((post) => {
        if (postMap[`${post.id}`]) {
          post.isAuthor = true;
        } else {
          post.isAuthor = false;
        }
      });

      return;
    }

    posts.forEach((post) => {
      post.isAuthor = false;
    });
  }
}

import { Identity } from '@database/identity';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { FilterUtils } from '@external/crud/common/pipes/filter.pipe';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { ArrayMapper } from '@external/mappers/array.mapper';
import { ArrayUtils } from '@external/utils/array/array.utils';
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
import { UpsertVoteDto } from '@vote/dto/upsert-vote.dto';
import { Vote } from '@vote/entities/vote.entity';
import { VoteService } from '@vote/vote.service';
import { keyBy } from 'lodash';
import { UserCredential } from 'src/auth/client/user-cred';
import { CommentService } from '@comment/comment.service';
import { UserService } from 'src/user/user.service';
import { EditablePostView } from './client/post-editable';
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
    private readonly topicService: TopicService,
    private readonly commentService: CommentService,
  ) {}

  public async init(initPostDto: InitPostDto, authContext: UserCredential) {
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

  public async createCommentOfPost(
    slug: string,
    createDiscussionDto: CreateCommentDto,
    authContext: UserCredential,
  ) {
    const post = await this.postRepository.findBySlug(slug);

    if (!post) {
      throw new NotFoundException('Not found post with slug ' + slug);
    }

    const author = await this.userService.findById(+authContext.userId);

    if (!author) {
      throw new UnprocessableEntityException('User is not available');
    }

    return this.commentService.createCommentForPost(
      post,
      createDiscussionDto,
      author,
    );
  }

  public async createReplyOfPost(
    slug: string,
    commentId: string,
    createDiscussionDto: CreateCommentDto,
    authContext: UserCredential,
  ) {
    const post = await this.postRepository.findBySlug(slug);

    if (!post) {
      throw new NotFoundException('Not found post with slug ' + slug);
    }

    const author = await this.userService.findById(+authContext.userId);

    if (!author) {
      throw new UnprocessableEntityException('User is not available');
    }

    return this.commentService.createReplyForPost(
      commentId,
      createDiscussionDto,
      author,
      post,
    );
  }

  public async findMany(
    searchQuery: SearchCriteria,
    authContext: UserCredential | undefined,
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
    const user: User | null = authContext
      ? await this.userService.findById(+authContext.userId)
      : null;
    await this.markAuthorForPosts(posts, user);

    return posts;
  }

  public async findPostsOfAuthor(
    searchQuery: SearchCriteria,
    targetAuthorHashTag: string,
    authContext: UserCredential | undefined,
  ) {
    const hashTags = [targetAuthorHashTag];
    if (authContext) {
      hashTags.push(authContext.hashTag);
    }
    const users = await this.userService.findByHashTag(hashTags);

    const [author, [targetAuthor]] = this.splitAuthorAndUsers(
      authContext?.userId,
      users,
    );

    if (!targetAuthor) {
      throw new NotFoundException(
        `Not found author with hashTag: ${targetAuthorHashTag}`,
      );
    }

    const posts: PostOverview = await this.postRepository.findPostsOfAuthor(
      searchQuery,
      targetAuthor,
    );

    await this.markAuthorForPosts(posts, author);

    if (FilterUtils.has(searchQuery.filters, 'scope')) {
      return this.mapScopeForPosts(posts);
    }

    return posts;
  }

  public async findOneForDetail(
    slug: string,
    optionalAuthor: UserCredential | undefined,
  ) {
    const post = await this.postRepository.findOne({
      where: {
        slug,
      },
      relations: ['author', 'topics', 'makers'],
    });

    if (!post) {
      throw new NotFoundException('Not found post with slug ' + slug);
    }

    post.isVoted = false;

    if (optionalAuthor) {
      const author: User = await this.userService.findById(
        +optionalAuthor.userId,
      );
      post.isVoted = await this.voteService.didUserVoteForPost(author, post);
    }

    const totalVotes = await this.voteService.countTotalVotesForPost(post);

    return {
      ...post,
      totalVotes,
    };
  }

  public findOneForEdit(slug: string) {
    return this.postRepository.findOne({
      where: {
        slug,
      },
      relations: ['author', 'topics', 'makers'],
    });
  }

  public async findRelatedDiscussions(
    slug: string,
    searchCriteria: SearchCriteria,
  ) {
    const post = await this.postRepository.findBySlug(slug);

    if (!post) {
      throw new UnprocessableEntityException(
        `Post with id: ${slug} does not exist that cannot find discussions`,
      );
    }
    return this.commentService.findCommentsOfPost(post, searchCriteria);
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

  public async upsertVoteOfPost(postId: number, author: UserCredential) {
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

    return this.voteService.upsertForPostVote(voteDto);
  }

  private async saveAsDraft(id: number, updatePostDto: UpdatePostDto) {
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

  private async publish(id: number, updatePostDto: UpdatePostDto) {
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
        updatePostDto.runningStatus = ProductRunningStatus.RELEASED;
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
    optionalAuthor: User | undefined,
  ): Promise<void> {
    if (optionalAuthor) {
      const votes: Vote[] = await this.voteService.findByAuthorAndPosts(
        optionalAuthor,
        <Identity[]>posts,
      );

      const postMap = keyBy(votes, 'post');

      posts.forEach((post) => {
        post.isVoted = !!postMap[`${post.id}`];
      });

      return;
    }

    posts.forEach((post) => {
      post.isVoted = false;
    });
  }

  private splitAuthorAndUsers(
    authorId: string,
    users: User[],
  ): [User | null, User[]] {
    if (!authorId) {
      return [null, users];
    }

    if (users.length === 1 && users[0].id === authorId) {
      return [users[0], users];
    }

    return users.reduce(
      (result, user) => {
        if (user.id === authorId) {
          result[0] = user;
        } else {
          result[1].push(user);
        }
        return result;
      },
      [null, []],
    );
  }

  private mapScopeForPosts(posts: PostOverview): EditablePostView {
    return posts.map((post) => {
      const canModify = post.status === PostStatus.DRAFT;
      return {
        id: post.id,
        slug: post.slug,
        status: post.status,
        thumbnail: post.thumbnail,
        title: post.title,
        updatedAt: post.updatedAt,
        canDelete: canModify,
        canUpdate: canModify,
        readonly: !canModify,
      };
    });
  }
}

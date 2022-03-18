import { CommentService } from '@comment/comment.service';
import { Identity } from '@database/identity';
import { FilterUtils } from '@external/crud/common/pipes/filter.pipe';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { RuleManager } from '@external/racl/core/rule.manager';
import { ArrayUtils } from '@external/utils/array/array.utils';
import { Optional } from '@external/utils/optional/optional.util';
import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PostRankingStrategy } from '@rank/rank-post.strategy';
import { RankService } from '@rank/rank.service';
import { User } from '@user/user.entity';
import { SlugUtils } from '@utils/slug';
import { UpsertVoteDto } from '@vote/dto/upsert-vote.dto';
import { Vote } from '@vote/entities/vote.entity';
import { VoteService } from '@vote/vote.service';
import { Cache } from 'cache-manager';
import { keyBy } from 'lodash';
import { UserCredential } from 'src/auth/client/user-cred';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { UserService } from 'src/user/user.service';
import { In } from 'typeorm';
import { Idea } from './client/ideas.api';
import { PostOverview } from './client/post-overview.api';
import { InitPostDto } from './dto/init-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FetchPostType } from './enums/fetch-post-type.enum';
import {
  PostStatus,
  PricingType,
  ProductRunningStatus,
} from './enums/post-status.enum';
import { ScopeMapper } from './mappers/scope.mapper';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostPublishValidator } from './validator/post-publish.validator';
import { PostUpdateValidator } from './validator/post-update.validator';

@Injectable()
export class PostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly rankService: RankService,
    private readonly voteService: VoteService,
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly postUpdateValidator: PostUpdateValidator,
    private readonly postPublishValidator: PostPublishValidator,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  public async init(initPostDto: InitPostDto, authContext: UserCredential) {
    if (await this.postRepository.isTitleConflict(initPostDto.title)) {
      throw new ConflictException(
        `Can not create post which is conflict with title: ${initPostDto.title}`,
      );
    }

    const author = await this.userService.findRequiredUserById(
      +authContext.userId,
    );

    const post = new Post();
    post.title = initPostDto.title;
    post.slug = SlugUtils.normalize(post.title);
    post.status = PostStatus.DRAFT;
    post.runningStatus = ProductRunningStatus.IDEA;
    post.productLink = '';
    post.videoLink = '';
    post.videoThumbnail = '';
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
    const post = await this.findRequiredPostBySlug(slug);

    const author = await this.userService.findRequiredUserById(
      +authContext.userId,
    );

    return Promise.all([
      this.commentService.createCommentForPost(
        post,
        createDiscussionDto,
        author,
      ),
      this.postService.sendNewCommentNotificationToFollowersAndAuthor(
        post,
        author,
      ),
    ]);
  }

  public async createReplyOfPost(
    slug: string,
    commentId: string,
    createDiscussionDto: CreateCommentDto,
    authContext: UserCredential,
  ) {
    const post = await this.findRequiredPostBySlug(slug);

    const author = await this.userService.findRequiredUserById(
      +authContext.userId,
    );

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

    /**
     * TODO: We need to fetch data for example: 20 -> and decentralized the post by date
     * -> Then we can decide to rank the data by date -> If records of that date was fulfill the requirements of request then caching it and return
     * -> Else start next date and continue ranking and repeat that job until fulfil the requirements
     */
    switch (fetchPostType.value) {
      case FetchPostType.LATEST:
        posts = await this.postRepository.findLatestPosts(searchQuery);
        break;
      case FetchPostType.HOTTEST:
        posts = await this.postRepository.findHottestPosts(searchQuery);
        posts = await this.getRankedPosts(posts, searchQuery);
        break;
      default:
        throw new BadRequestException('Unsupported filter type to get posts');
    }

    const user: User | null = authContext
      ? await this.userService.findRequiredUserById(+authContext.userId)
      : null;
    await this.markAuthorForPosts(posts, user);

    return posts;
  }

  public async findIdeas(
    searchQuery: SearchCriteria,
    authContext: UserCredential | undefined,
  ): Promise<Idea[]> {
    const ideas = await this.postRepository.findIdeaPosts(searchQuery);
    return this.mapFollowedByIdeas(ideas, authContext);
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

    const [author, [targetAuthor]] = this.userService.splitAuthorAndUsers(
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
      return ScopeMapper().map(posts);
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
      relations: ['author', 'topics', 'makers', 'followers'],
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
    const post = await this.findRequiredPostBySlug(slug);
    return this.commentService.findCommentsOfPost(post, searchCriteria);
  }

  public async followIdea(id: string, authContext: UserCredential) {
    const user = Optional(
      await this.userService.findByIdWithFollowedIdeas(+authContext.userId),
    ).orElseThrow(
      () => new UnprocessableEntityException('User is not available to follow'),
    );

    const idea = Optional(
      await this.postRepository.findOne(id, {
        where: {
          status: PostStatus.PUBLISH,
          runningStatus: In([
            ProductRunningStatus.LOOKING_FOR_MEMBERS,
            ProductRunningStatus.IDEA,
          ]),
        },
      }),
    ).orElseThrow(
      () => new UnprocessableEntityException('Idea is not available'),
    );

    await this.postRepository.toggleFollow(idea, user);
  }

  public async remove(
    id: number,
    authContext: UserCredential,
    ruleManager: RuleManager,
  ) {
    const post = await this.postRepository.findOne(id, {
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`There is no post with id ${id} to delete`);
    }

    if (post.status !== PostStatus.DRAFT) {
      throw new UnprocessableEntityException(
        `Post with id: ${id} is not draft that cannot be deleted`,
      );
    }
    const author = await this.userService.findById(+authContext.userId);
    if (!author) {
      throw new UnprocessableEntityException('User is not available');
    }
    if (post.author.id !== author.id) {
      throw new UnprocessableEntityException(
        `User with id: ${author.id} is not author of post with id: ${id}`,
      );
    }
    return this.postRepository.remove(post);
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

    if (!post) {
      throw new NotFoundException(`Post ${id} not found to update`);
    }

    if (post.status !== PostStatus.DRAFT) {
      throw new UnprocessableEntityException(
        `Post is not in status draft. Current status is : ${post.status}`,
      );
    }

    await this.postUpdateValidator.compare(post, updatePostDto);

    await this.postService.updatePost(post, updatePostDto);

    return this.postRepository.save(post);
  }

  private async publish(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne(id, {
      relations: ['topics', 'makers', 'author'],
    });

    if (!post) {
      throw new NotFoundException(`Post ${id} not found to update`);
    }

    await this.postUpdateValidator.compare(post, updatePostDto);
    this.postPublishValidator.compare(post, updatePostDto);

    await this.postService.updatePost(post, updatePostDto);

    if (post.status !== PostStatus.PUBLISH) {
      this.postService.sendPublishNotificationToTopicFollowers(post);
    }

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
    }

    posts.forEach((post) => {
      post.isVoted = false;
    });
  }

  private async mapFollowedByIdeas(
    ideas: Post[],
    authContext: UserCredential | undefined,
  ): Promise<Idea[]> {
    if (authContext) {
      const user = await this.userService.findByIdWithFollowedIdeas(
        +authContext.userId,
      );
      if (!user) {
        throw new UnprocessableEntityException('User is not available');
      }

      const ideaKeyMap = keyBy(user.followedIdeas, 'id');
      return ideas.map((idea: Post) => {
        return {
          ...idea,
          isFollowed: !!ideaKeyMap[`${idea.id}`],
        };
      });
    }
    return ideas.map((idea) => {
      return {
        ...idea,
        isFollowed: false,
      };
    });
  }

  private async findRequiredPostBySlug(slug: string) {
    return Optional(await this.postRepository.findBySlug(slug)).orElseThrow(
      () => new UnprocessableEntityException(),
    );
  }

  // Key posts by createdAt and rank them by their totalVotes and totalReplies
  private async getRankedPosts(
    posts: PostOverview,
    searchQuery: SearchCriteria,
  ): Promise<PostOverview> {
    const postsKeyByCreatedDate = new Map<string, PostOverview>();
    posts.forEach((post) => {
      const createdDate = post.createdAt.toDateString();
      if (postsKeyByCreatedDate.has(createdDate)) {
        postsKeyByCreatedDate.get(createdDate).push(post);
      } else {
        postsKeyByCreatedDate.set(createdDate, [post]);
      }
    });

    const result: PostOverview = [];

    for (const [rankDate, currentPosts] of postsKeyByCreatedDate.entries()) {
      if (result.length >= searchQuery.limit) {
        break;
      }

      // TODO: We may skip computation because we have already computed rank
      const remainingSize = searchQuery.limit - result.length;

      if (currentPosts.length < remainingSize) {
        result.push(
          ...this.rankService.rank(currentPosts, PostRankingStrategy),
        );
      } else {
        const fullPostsGetByDate =
          await this.postRepository.findPostsByCreatedDate(rankDate);
        const rankedPosts = this.rankService.rank(
          fullPostsGetByDate,
          PostRankingStrategy,
        );

        result.push(
          ...(rankedPosts.length > remainingSize
            ? rankedPosts.slice(0, remainingSize)
            : rankedPosts),
        );
      }
    }
    return result;
  }
}
